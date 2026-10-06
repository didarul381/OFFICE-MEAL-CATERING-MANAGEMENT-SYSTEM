<?php

namespace App\Policies;

use App\Models\MenuItem;
use App\Models\User;

class MenuItemPolicy
{
    /**
     * Determine whether the user can view any menu items.
     */
    public function viewAny(User $user): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff() || $user->isClientAdmin();
    }

    /**
     * Determine whether the user can view the menu item.
     */
    public function view(User $user, MenuItem $menuItem): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff() || $user->isClientAdmin();
    }

    /**
     * Determine whether the user can create menu items.
     */
    public function create(User $user): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff();
    }

    /**
     * Determine whether the user can update the menu item.
     */
    public function update(User $user, MenuItem $menuItem): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff();
    }

    /**
     * Determine whether the user can delete the menu item.
     */
    public function delete(User $user, MenuItem $menuItem): bool
    {
        return $user->isVendorAdmin();
    }
}
