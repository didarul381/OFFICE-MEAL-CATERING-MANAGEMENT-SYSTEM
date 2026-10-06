<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    /**
     * Determine whether the user can view any employees.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && ! empty($user->client_id);
    }

    /**
     * Determine whether the user can view the employee.
     */
    public function view(User $user, Employee $employee): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && (int) $user->client_id === (int) $employee->client_id;
    }

    /**
     * Determine whether the user can create employees.
     */
    public function create(User $user): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && ! empty($user->client_id);
    }

    /**
     * Determine whether the user can update the employee.
     */
    public function update(User $user, Employee $employee): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && (int) $user->client_id === (int) $employee->client_id;
    }

    /**
     * Determine whether the user can delete the employee.
     */
    public function delete(User $user, Employee $employee): bool
    {
        if ($user->isVendorAdmin()) {
            return true;
        }

        return $user->isClientAdmin() && (int) $user->client_id === (int) $employee->client_id;
    }

    /**
     * Determine whether the user can import employees in bulk.
     */
    public function import(User $user): bool
    {
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && ! empty($user->client_id);
    }
}
