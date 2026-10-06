<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the menu items.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MenuItem::class);

        $query = MenuItem::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        $menuItems = $query->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => MenuItem::count(),
            'active' => MenuItem::where('is_active', true)->count(),
            'main_courses' => MenuItem::where('category', 'Main Course')->count(),
            'proteins' => MenuItem::where('category', 'Protein')->count(),
        ];

        return Inertia::render('MenuItems/Index', [
            'menuItems' => $menuItems,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => MenuItem::CATEGORIES,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new menu item.
     */
    public function create(): Response
    {
        $this->authorize('create', MenuItem::class);

        return Inertia::render('MenuItems/Create', [
            'categories' => MenuItem::CATEGORIES,
        ]);
    }

    /**
     * Store a newly created menu item in storage.
     */
    public function store(StoreMenuItemRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public');
            $data['image_path'] = $path;
        }

        unset($data['image']);
        $menuItem = MenuItem::create($data);

        return redirect()->route('menu-items.index')
            ->with('success', "Menu item '{$menuItem->name}' created successfully.");
    }

    /**
     * Show the form for editing the specified menu item.
     */
    public function edit(MenuItem $menuItem): Response
    {
        $this->authorize('update', $menuItem);

        return Inertia::render('MenuItems/Edit', [
            'menuItem' => $menuItem,
            'categories' => MenuItem::CATEGORIES,
        ]);
    }

    /**
     * Update the specified menu item in storage.
     */
    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($menuItem->image_path && Storage::disk('public')->exists($menuItem->image_path)) {
                Storage::disk('public')->delete($menuItem->image_path);
            }
            $data['image_path'] = $request->file('image')->store('menu_items', 'public');
        }

        unset($data['image']);
        $menuItem->update($data);

        return redirect()->route('menu-items.index')
            ->with('success', "Menu item '{$menuItem->name}' updated successfully.");
    }

    /**
     * Toggle active/inactive status of the menu item.
     */
    public function toggleStatus(MenuItem $menuItem): RedirectResponse
    {
        $this->authorize('update', $menuItem);

        $menuItem->update(['is_active' => ! $menuItem->is_active]);

        $status = $menuItem->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Menu item '{$menuItem->name}' has been {$status}.");
    }

    /**
     * Remove the specified menu item from storage.
     */
    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $this->authorize('delete', $menuItem);

        $name = $menuItem->name;
        $menuItem->delete();

        return redirect()->route('menu-items.index')
            ->with('success', "Menu item '{$name}' deleted successfully.");
    }
}
