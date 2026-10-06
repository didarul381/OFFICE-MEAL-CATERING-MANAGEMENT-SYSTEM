<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ClientPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasVendorAccess();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Client $client): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        // Client isolation: Client Admin can ONLY view their own client
        return $user->isClientAdmin() && (int) $user->client_id === (int) $client->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasVendorAccess();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Client $client): bool
    {
        if ($user->isVendorAdmin()) {
            return true;
        }

        if ($user->isVendorStaff()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->isVendorAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Client $client): bool
    {
        return $user->isVendorAdmin();
    }

    /**
     * Determine whether the user can manage client users for the client.
     */
    public function manageUsers(User $user, Client $client): bool
    {
        if ($user->isVendorAdmin()) {
            return true;
        }

        return $user->isClientAdmin() && (int) $user->client_id === (int) $client->id;
    }
}
