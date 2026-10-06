<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_profile_screen_can_be_rendered(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->get(route('vendor.profile'));

        $response->assertOk();
    }

    public function test_vendor_admin_can_update_vendor_profile(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'active',
        ]);

        $updateData = [
            'business_name' => 'Royal Kitchen & Catering',
            'organization_name' => 'Royal Food Logistics Ltd.',
            'owner_name' => 'Rafiqul Islam',
            'phone' => '+880 1711-223344',
            'email' => 'contact@royalkitchen.com',
            'address' => 'House 10, Road 4, Gulshan-1',
            'city' => 'Dhaka',
            'business_type' => 'Corporate Catering & Meals',
            'vat_tin' => 'BIN-1122334455',
            'status' => 'active',
        ];

        $response = $this->actingAs($admin)
            ->post(route('vendor.profile.update'), $updateData);

        $response->assertRedirect(route('vendor.profile'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('vendor_profiles', [
            'business_name' => 'Royal Kitchen & Catering',
            'city' => 'Dhaka',
            'vat_tin' => 'BIN-1122334455',
        ]);
    }

    public function test_vendor_staff_cannot_update_vendor_profile(): void
    {
        $staff = User::factory()->create([
            'role' => User::ROLE_VENDOR_STAFF,
            'status' => 'active',
        ]);

        $updateData = [
            'business_name' => 'Unauthorized Change',
            'owner_name' => 'Unauthorized',
            'phone' => '+880 1711-000000',
            'email' => 'staff@unauth.com',
            'address' => 'Test Address',
            'city' => 'Dhaka',
            'business_type' => 'Catering',
            'status' => 'active',
        ];

        $response = $this->actingAs($staff)
            ->post(route('vendor.profile.update'), $updateData);

        $response->assertForbidden();
    }

    public function test_vendor_profile_validation_requires_mandatory_fields(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('vendor.profile.update'), [
                'business_name' => '',
                'owner_name' => '',
                'phone' => '',
                'email' => 'invalid-email',
                'address' => '',
                'city' => '',
                'business_type' => '',
                'status' => 'not_valid',
            ]);

        $response->assertSessionHasErrors([
            'business_name',
            'owner_name',
            'phone',
            'email',
            'address',
            'city',
            'business_type',
            'status',
        ]);
    }
}
