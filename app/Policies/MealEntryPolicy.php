<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\MealEntry;
use App\Models\User;

class MealEntryPolicy
{
    /**
     * Determine whether the user can view meal rosters and history.
     */
    public function viewAny(User $user): bool
    {
        return $user->isVendorAdmin() || $user->isVendorStaff() || $user->isClientAdmin();
    }

    /**
     * Determine whether the user can view the specific meal entry.
     */
    public function view(User $user, MealEntry $mealEntry): bool
    {
        if ($user->isVendorAdmin() || $user->isVendorStaff()) {
            return true;
        }

        if ($user->isClientAdmin()) {
            return (int) $user->client_id === (int) $mealEntry->client_id;
        }

        return false;
    }

    /**
     * Determine whether the user can manage/record daily meals for a given client.
     */
    public function manage(User $user, Client $client): bool
    {
        if ($user->isVendorAdmin()) {
            return true;
        }

        if ($user->isVendorStaff()) {
            return true;
        }

        if ($user->isClientAdmin()) {
            return (int) $user->client_id === (int) $client->id;
        }

        return false;
    }
}
