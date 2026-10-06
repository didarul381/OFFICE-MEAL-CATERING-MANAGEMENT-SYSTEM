<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientUserRequest;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientUserController extends Controller
{
    /**
     * Store a newly created client user under the given client organization.
     */
    public function store(StoreClientUserRequest $request, Client $client): RedirectResponse
    {
        $this->authorize('manageUsers', $client);

        $validated = $request->validated();

        $clientUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $client->id,
            'status' => $validated['status'] ?? 'active',
        ]);

        return back()->with('success', "Client user '{$clientUser->name}' created successfully with login email: {$clientUser->email}.");
    }

    /**
     * Toggle client user active / inactive status.
     */
    public function toggleStatus(Request $request, Client $client, User $user): RedirectResponse
    {
        $this->authorize('manageUsers', $client);

        if ((int) $user->client_id !== (int) $client->id) {
            abort(403, 'User does not belong to this client organization.');
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        return back()->with('success', "Client user status changed to {$newStatus}.");
    }
}
