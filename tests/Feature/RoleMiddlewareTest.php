<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_protected_vendor_routes(): void
    {
        $response = $this->get(route('vendor.profile'));

        $response->assertRedirect(route('login'));
    }

    public function test_vendor_admin_can_access_vendor_profile(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->get(route('vendor.profile'));

        $response->assertOk();
    }

    public function test_vendor_staff_can_view_vendor_profile(): void
    {
        $staff = User::factory()->create([
            'role' => User::ROLE_VENDOR_STAFF,
            'status' => 'active',
        ]);

        $response = $this->actingAs($staff)->get(route('vendor.profile'));

        $response->assertOk();
    }

    public function test_client_admin_cannot_access_vendor_profile(): void
    {
        $clientAdmin = User::factory()->create([
            'role' => User::ROLE_CLIENT_ADMIN,
            'status' => 'active',
        ]);

        $response = $this->actingAs($clientAdmin)->get(route('vendor.profile'));

        $response->assertForbidden();
    }

    public function test_rider_cannot_access_vendor_profile(): void
    {
        $rider = User::factory()->create([
            'role' => User::ROLE_RIDER,
            'status' => 'active',
        ]);

        $response = $this->actingAs($rider)->get(route('vendor.profile'));

        $response->assertForbidden();
    }

    public function test_inactive_user_is_logged_out_and_redirected(): void
    {
        $inactiveUser = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'inactive',
        ]);

        $response = $this->actingAs($inactiveUser)->get(route('vendor.profile'));

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
