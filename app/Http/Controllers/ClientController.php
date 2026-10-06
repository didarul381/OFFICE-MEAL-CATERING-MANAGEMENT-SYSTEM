<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of client organizations.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Strict Client Isolation: Client Admin is redirected to their own organization details
        if ($user->isClientAdmin()) {
            if ($user->client_id) {
                return redirect()->route('clients.show', $user->client_id);
            }
            abort(403, 'No client organization assigned to your account.');
        }

        // Vendor Access check
        $this->authorize('viewAny', Client::class);

        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $city = $request->input('city', 'all');

        $clients = Client::query()
            ->search($search)
            ->filterStatus($status)
            ->filterCity($city)
            ->withCount('users')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $cities = Client::query()
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city');

        $metrics = [
            'total_clients' => Client::count(),
            'active_clients' => Client::where('status', 'active')->count(),
            'total_contracted_employees' => Client::sum('number_of_employees'),
        ];

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'city' => $city,
            ],
            'cities' => $cities,
            'metrics' => $metrics,
            'canCreate' => $user->isVendorAdmin() || $user->isVendorStaff(),
        ]);
    }

    /**
     * Show the form for creating a new client.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', Client::class);

        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created client.
     */
    public function store(StoreClientRequest $request): RedirectResponse
    {
        $this->authorize('create', Client::class);

        $client = DB::transaction(function () use ($request) {
            $data = $request->validated();
            if (empty($data['meal_types'])) {
                $data['meal_types'] = ['lunch'];
            }
            return Client::create($data);
        });

        return redirect()->route('clients.show', $client->id)
            ->with('success', "Client organization '{$client->name}' created successfully.");
    }

    /**
     * Display the specified client details.
     */
    public function show(Request $request, Client $client): Response
    {
        $this->authorize('view', $client);

        $client->load('users');

        // Foundational operational stats for client
        $stats = [
            'enrolled_employees' => $client->number_of_employees,
            'today_meals' => (int) round($client->number_of_employees * 0.8),
            'monthly_meals' => (int) round($client->number_of_employees * 0.8 * 22),
            'outstanding_balance' => round($client->number_of_employees * 0.8 * 22 * 120 * 0.35, 2),
        ];

        // Recent meal activity highlight placeholder
        $recentActivity = [
            [
                'date' => date('Y-m-d'),
                'meal_type' => 'Lunch',
                'count' => (int) round($client->number_of_employees * 0.8),
                'amount' => round($client->number_of_employees * 0.8 * 120, 2),
                'status' => 'Confirmed',
            ],
            [
                'date' => date('Y-m-d', strtotime('-1 day')),
                'meal_type' => 'Lunch',
                'count' => (int) round($client->number_of_employees * 0.82),
                'amount' => round($client->number_of_employees * 0.82 * 120, 2),
                'status' => 'Delivered',
            ],
            [
                'date' => date('Y-m-d', strtotime('-2 days')),
                'meal_type' => 'Lunch',
                'count' => (int) round($client->number_of_employees * 0.78),
                'amount' => round($client->number_of_employees * 0.78 * 120, 2),
                'status' => 'Delivered',
            ],
        ];

        $user = $request->user();

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'clientUsers' => $client->users,
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'canEdit' => $user->hasVendorAccess(),
            'canDelete' => $user->isVendorAdmin(),
            'canManageUsers' => $user->isVendorAdmin(),
        ]);
    }

    /**
     * Show the form for editing the client.
     */
    public function edit(Request $request, Client $client): Response
    {
        $this->authorize('update', $client);

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified client.
     */
    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $this->authorize('update', $client);

        DB::transaction(function () use ($request, $client) {
            $data = $request->validated();
            if (empty($data['meal_types'])) {
                $data['meal_types'] = ['lunch'];
            }
            $client->update($data);
        });

        return redirect()->route('clients.show', $client->id)
            ->with('success', "Client organization '{$client->name}' updated successfully.");
    }

    /**
     * Quick toggle active / inactive status.
     */
    public function toggleStatus(Request $request, Client $client): RedirectResponse
    {
        $this->authorize('update', $client);

        $newStatus = $client->status === 'active' ? 'inactive' : 'active';
        $client->update(['status' => $newStatus]);

        return back()->with('success', "Client status changed to {$newStatus}.");
    }

    /**
     * Soft delete the client.
     */
    public function destroy(Request $request, Client $client): RedirectResponse
    {
        $this->authorize('delete', $client);

        $clientName = $client->name;
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', "Client organization '{$clientName}' deactivated and moved to trash.");
    }
}
