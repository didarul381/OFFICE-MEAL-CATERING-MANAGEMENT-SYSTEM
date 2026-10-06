<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateClientPricingRequest;
use App\Models\Client;
use App\Models\ClientMenuPrice;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClientPricingController extends Controller
{
    /**
     * Display client pricing overview.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // If client admin, redirect directly to their own pricing view
        if ($user->isClientAdmin()) {
            return redirect()->route('client-pricing.show', $user->client_id);
        }

        $query = Client::query();

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        $clients = $query->withCount('clientMenuPrices')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_clients' => Client::count(),
            'avg_lunch_rate' => round(Client::avg('lunch_rate') ?? 0, 2),
            'avg_dinner_rate' => round(Client::avg('dinner_rate') ?? 0, 2),
        ];

        return Inertia::render('Pricing/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display a specific client's pricing structure (read-only view for client or vendor).
     */
    public function show(Client $client, Request $request): Response
    {
        $user = $request->user();

        // Enforce isolation: client admin can only see their own pricing
        if ($user->isClientAdmin() && (int) $user->client_id !== (int) $client->id) {
            abort(403, 'Unauthorized access to client pricing.');
        }

        $menuItems = MenuItem::where('is_active', true)->orderBy('category')->orderBy('name')->get();
        $customPrices = $client->clientMenuPrices()->pluck('custom_price', 'menu_item_id')->toArray();

        return Inertia::render('Pricing/Show', [
            'client' => $client,
            'menuItems' => $menuItems,
            'customPrices' => $customPrices,
            'canEdit' => $user->isVendorAdmin() || $user->isVendorStaff(),
        ]);
    }

    /**
     * Show the edit form for configuring client meal rates and item overrides.
     */
    public function edit(Client $client, Request $request): Response
    {
        $user = $request->user();
        if ($user->isClientAdmin()) {
            abort(403, 'Client users cannot edit contract pricing.');
        }

        $menuItems = MenuItem::orderBy('category')->orderBy('name')->get();
        $existingPrices = $client->clientMenuPrices()->pluck('custom_price', 'menu_item_id')->toArray();

        return Inertia::render('Pricing/Edit', [
            'client' => $client,
            'menuItems' => $menuItems,
            'existingPrices' => $existingPrices,
        ]);
    }

    /**
     * Update client pricing and item overrides.
     */
    public function update(UpdateClientPricingRequest $request, Client $client): RedirectResponse
    {
        $data = $request->validated();

        DB::beginTransaction();
        try {
            // Update client package rates
            $client->update([
                'lunch_rate' => $data['lunch_rate'],
                'dinner_rate' => $data['dinner_rate'],
            ]);

            // Sync item-level price overrides
            $customPrices = $data['custom_prices'] ?? [];
            
            // Delete removed overrides
            $menuItemIds = collect($customPrices)->pluck('menu_item_id')->toArray();
            $client->clientMenuPrices()->whereNotIn('menu_item_id', $menuItemIds)->delete();

            foreach ($customPrices as $item) {
                if (! empty($item['custom_price']) && (float) $item['custom_price'] > 0) {
                    ClientMenuPrice::updateOrCreate(
                        [
                            'client_id' => $client->id,
                            'menu_item_id' => $item['menu_item_id'],
                        ],
                        [
                            'custom_price' => $item['custom_price'],
                            'is_active' => true,
                        ]
                    );
                } else {
                    $client->clientMenuPrices()->where('menu_item_id', $item['menu_item_id'])->delete();
                }
            }

            DB::commit();

            return redirect()->route('client-pricing.index')
                ->with('success', "Contract rates updated for '{$client->name}' successfully.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update client rates: ' . $e->getMessage());
        }
    }
}
