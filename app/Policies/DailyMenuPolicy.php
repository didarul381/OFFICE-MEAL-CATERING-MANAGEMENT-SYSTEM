<?php

namespace App\Policies;

use App\Models\DailyMenu;
use App\Models\User;

class DailyMenuPolicy
{
    /**
     * Determine whether the user can view any daily menus.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the daily menu.
     */
    public function view(User $user, DailyMenu $dailyMenu): bool
    {
        if ($user->isVendorAdmin() || $user->isVendorStaff()) {
            return true;
        }

        // If client user, can view if it is global (client_id is null) or matches user's client_id
        if ($user->isClientAdmin()) {
            return $dailyMenu->client_id === null || (int) $dailyMenu->client_id === (int) $user->client_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create daily menus.
     */
    public function create(User $user): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff();
    }

    /**
     * Determine whether the user can update the daily menu.
     */
    public function update(User $user, DailyMenu $dailyMenu): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff();
    }

    /**
     * Determine whether the user can delete the daily menu.
     */
    public function delete(User $user, DailyMenu $dailyMenu): bool
    {
        return $user->isVendorAdmin();
    }
}
