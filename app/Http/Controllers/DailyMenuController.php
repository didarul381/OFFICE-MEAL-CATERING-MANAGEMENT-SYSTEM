<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDailyMenuRequest;
use App\Http\Requests\UpdateDailyMenuRequest;
use App\Models\Client;
use App\Models\DailyMenu;
use App\Models\DailyMenuItem;
use App\Models\MenuItem;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DailyMenuController extends Controller
{
    /**
     * Display a listing of daily menus.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', DailyMenu::class);

        $user = $request->user();
        $query = DailyMenu::with(['client', 'items.menuItem']);

        // Client admin can only see global menus OR menus assigned to their client
        if ($user->isClientAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('client_id')->orWhere('client_id', $user->client_id);
            });
        } elseif ($request->filled('client_id') && $request->input('client_id') !== 'all') {
            if ($request->input('client_id') === 'global') {
                $query->whereNull('client_id');
            } else {
                $query->where('client_id', $request->input('client_id'));
            }
        }

        if ($request->filled('date')) {
            $query->where('date', $request->input('date'));
        }

        if ($request->filled('meal_type') && $request->input('meal_type') !== 'all') {
            $query->where('meal_type', $request->input('meal_type'));
        }

        $dailyMenus = $query->orderBy('date', 'desc')
            ->orderBy('meal_type')
            ->paginate(15)
            ->withQueryString();

        $clients = Client::active()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DailyMenus/Index', [
            'dailyMenus' => $dailyMenus,
            'clients' => $clients,
            'filters' => $request->only(['date', 'meal_type', 'client_id']),
            'isClientAdmin' => $user->isClientAdmin(),
        ]);
    }

    /**
     * Show the form for creating a new daily menu.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', DailyMenu::class);

        $menuItems = MenuItem::where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $clients = Client::active()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DailyMenus/Create', [
            'menuItems' => $menuItems,
            'clients' => $clients,
            'defaultDate' => $request->input('date', Carbon::today()->format('Y-m-d')),
            'defaultMealType' => $request->input('meal_type', 'Lunch'),
            'defaultClientId' => $request->input('client_id', ''),
        ]);
    }

    /**
     * Store a newly created daily menu in storage.
     */
    public function store(StoreDailyMenuRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Check if menu already exists for date + meal_type + client
        $existing = DailyMenu::where('date', $data['date'])
            ->where('meal_type', $data['meal_type'])
            ->where('client_id', $data['client_id'] ?: null)
            ->first();

        if ($existing) {
            $target = $data['client_id'] ? 'this client' : 'all clients (global)';
            return back()->with('error', "A {$data['meal_type']} menu already exists for {$target} on {$data['date']}.");
        }

        DB::beginTransaction();
        try {
            $dailyMenu = DailyMenu::create([
                'client_id' => $data['client_id'] ?: null,
                'date' => $data['date'],
                'meal_type' => $data['meal_type'],
                'title' => $data['title'] ?? ($data['meal_type'] . ' Menu - ' . Carbon::parse($data['date'])->format('M d, Y')),
                'base_price' => $data['base_price'] ?? null,
                'notes' => $data['notes'] ?? null,
                'is_published' => $data['is_published'] ?? true,
            ]);

            foreach ($data['items'] as $index => $item) {
                DailyMenuItem::create([
                    'daily_menu_id' => $dailyMenu->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'serving_portion' => $item['serving_portion'] ?? null,
                    'sort_order' => $index,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('daily-menus.index')
                ->with('success', "Daily menu for {$dailyMenu->date->format('M d, Y')} ({$dailyMenu->meal_type}) created successfully.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create daily menu: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified daily menu.
     */
    public function show(DailyMenu $dailyMenu): Response
    {
        $this->authorize('view', $dailyMenu);

        $dailyMenu->load(['client', 'items.menuItem']);

        return Inertia::render('DailyMenus/Show', [
            'dailyMenu' => $dailyMenu,
            'canManage' => auth()->user()->isVendorAdmin() || auth()->user()->isVendorStaff(),
        ]);
    }

    /**
     * Show the form for editing the specified daily menu.
     */
    public function edit(DailyMenu $dailyMenu): Response
    {
        $this->authorize('update', $dailyMenu);

        $dailyMenu->load(['client', 'items.menuItem']);
        $menuItems = MenuItem::where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get();
        $clients = Client::active()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DailyMenus/Edit', [
            'dailyMenu' => $dailyMenu,
            'menuItems' => $menuItems,
            'clients' => $clients,
        ]);
    }

    /**
     * Update the specified daily menu in storage.
     */
    public function update(UpdateDailyMenuRequest $request, DailyMenu $dailyMenu): RedirectResponse
    {
        $data = $request->validated();

        // Check unique constraint excluding this ID
        $existing = DailyMenu::where('date', $data['date'])
            ->where('meal_type', $data['meal_type'])
            ->where('client_id', $data['client_id'] ?: null)
            ->where('id', '!=', $dailyMenu->id)
            ->first();

        if ($existing) {
            return back()->with('error', "Another menu already exists for that client and date/meal type combination.");
        }

        DB::beginTransaction();
        try {
            $dailyMenu->update([
                'client_id' => $data['client_id'] ?: null,
                'date' => $data['date'],
                'meal_type' => $data['meal_type'],
                'title' => $data['title'] ?? null,
                'base_price' => $data['base_price'] ?? null,
                'notes' => $data['notes'] ?? null,
                'is_published' => $data['is_published'] ?? true,
            ]);

            // Recreate items
            $dailyMenu->items()->delete();
            foreach ($data['items'] as $index => $item) {
                DailyMenuItem::create([
                    'daily_menu_id' => $dailyMenu->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'serving_portion' => $item['serving_portion'] ?? null,
                    'sort_order' => $index,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('daily-menus.index')
                ->with('success', "Daily menu updated successfully.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update daily menu: ' . $e->getMessage());
        }
    }

    /**
     * Duplicate an existing menu to a target date.
     */
    public function duplicate(DailyMenu $dailyMenu, Request $request): RedirectResponse
    {
        $this->authorize('create', DailyMenu::class);

        $request->validate([
            'target_date' => ['required', 'date'],
            'target_meal_type' => ['required', 'in:Lunch,Dinner'],
            'target_client_id' => ['nullable', 'exists:clients,id'],
        ]);

        $targetDate = $request->input('target_date');
        $targetMealType = $request->input('target_meal_type');
        $targetClientId = $request->input('target_client_id') ?: null;

        $existing = DailyMenu::where('date', $targetDate)
            ->where('meal_type', $targetMealType)
            ->where('client_id', $targetClientId)
            ->first();

        if ($existing) {
            return back()->with('error', "A menu already exists for that target date and meal type.");
        }

        DB::beginTransaction();
        try {
            $newMenu = DailyMenu::create([
                'client_id' => $targetClientId,
                'date' => $targetDate,
                'meal_type' => $targetMealType,
                'title' => $dailyMenu->title,
                'base_price' => $dailyMenu->base_price,
                'notes' => $dailyMenu->notes,
                'is_published' => true,
            ]);

            foreach ($dailyMenu->items as $item) {
                DailyMenuItem::create([
                    'daily_menu_id' => $newMenu->id,
                    'menu_item_id' => $item->menu_item_id,
                    'serving_portion' => $item->serving_portion,
                    'sort_order' => $item->sort_order,
                    'notes' => $item->notes,
                ]);
            }

            DB::commit();

            return redirect()->route('daily-menus.index')
                ->with('success', "Menu duplicated successfully to {$targetDate} ({$targetMealType}).");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to duplicate menu: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified daily menu from storage.
     */
    public function destroy(DailyMenu $dailyMenu): RedirectResponse
    {
        $this->authorize('delete', $dailyMenu);

        $dailyMenu->delete();

        return redirect()->route('daily-menus.index')
            ->with('success', 'Daily menu removed successfully.');
    }
}
