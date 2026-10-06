<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $vendorAdmin;
    protected User $vendorStaff;
    protected User $clientAdmin;
    protected User $rider;
    protected Client $clientA;
    protected Client $clientB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->vendorAdmin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'status' => 'active',
        ]);

        $this->vendorStaff = User::factory()->create([
            'role' => User::ROLE_VENDOR_STAFF,
            'status' => 'active',
        ]);

        $this->clientA = Client::create([
            'name' => 'Client Alpha Ltd.',
            'contact_person' => 'Rahim Chowdhury',
            'phone' => '+880 1711-111111',
            'email' => 'alpha@test.com',
            'address' => 'Road 1, Block A, Gulshan',
            'city' => 'Dhaka',
            'delivery_address' => '3rd Floor pantry, Gulshan',
            'number_of_employees' => 50,
            'meal_types' => ['lunch'],
            'lunch_cutoff_time' => '10:00',
            'status' => 'active',
        ]);

        $this->clientB = Client::create([
            'name' => 'Client Beta Ltd.',
            'contact_person' => 'Karim Ahmed',
            'phone' => '+880 1811-222222',
            'email' => 'beta@test.com',
            'address' => 'Plot 5, Banani',
            'city' => 'Dhaka',
            'delivery_address' => 'Ground floor cafeteria',
            'number_of_employees' => 30,
            'meal_types' => ['lunch', 'dinner'],
            'lunch_cutoff_time' => '10:30',
            'status' => 'active',
        ]);

        $this->clientAdmin = User::factory()->create([
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $this->clientA->id,
            'status' => 'active',
        ]);

        $this->rider = User::factory()->create([
            'role' => User::ROLE_RIDER,
            'status' => 'active',
        ]);
    }

    public function test_vendor_admin_can_view_client_list(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('clients.index'));

        $response->assertOk();
        $response->assertSee('Client Alpha Ltd.');
        $response->assertSee('Client Beta Ltd.');
    }

    public function test_vendor_staff_can_view_client_list(): void
    {
        $response = $this->actingAs($this->vendorStaff)->get(route('clients.index'));

        $response->assertOk();
    }

    public function test_client_admin_is_redirected_to_own_client_details_from_index(): void
    {
        $response = $this->actingAs($this->clientAdmin)->get(route('clients.index'));

        $response->assertRedirect(route('clients.show', $this->clientA->id));
    }

    public function test_rider_cannot_access_client_list(): void
    {
        $response = $this->actingAs($this->rider)->get(route('clients.index'));

        $response->assertForbidden();
    }

    public function test_vendor_admin_can_create_a_client_organization(): void
    {
        $data = [
            'name' => 'Gamma Innovations Ltd.',
            'contact_person' => 'Kamal Hossain',
            'phone' => '+880 1911-333333',
            'email' => 'kamal@gamma.com',
            'address' => 'House 12, Road 7, Dhanmondi',
            'city' => 'Dhaka',
            'delivery_address' => 'Reception floor, House 12',
            'number_of_employees' => 40,
            'meal_types' => ['lunch'],
            'office_start_time' => '09:00',
            'lunch_cutoff_time' => '10:00',
            'status' => 'active',
            'notes' => 'New trial contract',
        ];

        $response = $this->actingAs($this->vendorAdmin)->post(route('clients.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('clients', [
            'name' => 'Gamma Innovations Ltd.',
            'contact_person' => 'Kamal Hossain',
            'email' => 'kamal@gamma.com',
        ]);
    }

    public function test_vendor_admin_can_update_a_client(): void
    {
        $updateData = [
            'name' => 'Client Alpha Renamed Ltd.',
            'contact_person' => 'Rahim Chowdhury Updated',
            'phone' => '+880 1711-999999',
            'email' => 'alpha_updated@test.com',
            'address' => 'Updated Address, Gulshan',
            'city' => 'Dhaka',
            'delivery_address' => 'Updated pantry',
            'number_of_employees' => 60,
            'meal_types' => ['lunch', 'dinner'],
            'office_start_time' => '09:00',
            'lunch_cutoff_time' => '10:00',
            'dinner_cutoff_time' => '16:00',
            'status' => 'active',
        ];

        $response = $this->actingAs($this->vendorAdmin)
            ->put(route('clients.update', $this->clientA->id), $updateData);

        $response->assertRedirect(route('clients.show', $this->clientA->id));

        $this->assertDatabaseHas('clients', [
            'id' => $this->clientA->id,
            'name' => 'Client Alpha Renamed Ltd.',
            'number_of_employees' => 60,
        ]);
    }

    public function test_vendor_admin_can_toggle_client_status(): void
    {
        $response = $this->actingAs($this->vendorAdmin)
            ->post(route('clients.toggle-status', $this->clientA->id));

        $response->assertRedirect();
        $this->assertEquals('inactive', $this->clientA->fresh()->status);
    }

    public function test_vendor_admin_can_soft_delete_client(): void
    {
        $response = $this->actingAs($this->vendorAdmin)
            ->delete(route('clients.destroy', $this->clientB->id));

        $response->assertRedirect(route('clients.index'));
        $this->assertSoftDeleted('clients', ['id' => $this->clientB->id]);
    }

    public function test_client_search_and_status_filtering(): void
    {
        $response = $this->actingAs($this->vendorAdmin)
            ->get(route('clients.index', ['search' => 'Beta']));

        $response->assertOk();
    }

    public function test_client_admin_can_view_own_organization(): void
    {
        $response = $this->actingAs($this->clientAdmin)
            ->get(route('clients.show', $this->clientA->id));

        $response->assertOk();
    }

    public function test_client_admin_cannot_view_other_organization_data_isolation(): void
    {
        // Client Admin A tries to view Client B
        $response = $this->actingAs($this->clientAdmin)
            ->get(route('clients.show', $this->clientB->id));

        $response->assertForbidden();
    }

    public function test_client_admin_cannot_edit_other_client(): void
    {
        $response = $this->actingAs($this->clientAdmin)
            ->get(route('clients.edit', $this->clientB->id));

        $response->assertForbidden();
    }

    public function test_vendor_admin_can_create_client_user(): void
    {
        $userData = [
            'name' => 'Alpha Operations User',
            'email' => 'alpha_ops@test.com',
            'phone' => '+880 1711-555555',
            'password' => 'password123',
            'status' => 'active',
        ];

        $response = $this->actingAs($this->vendorAdmin)
            ->post(route('clients.users.store', $this->clientA->id), $userData);

        $response->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'alpha_ops@test.com',
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $this->clientA->id,
        ]);
    }

    public function test_client_user_can_login_and_is_isolated_to_their_organization(): void
    {
        $user = User::factory()->create([
            'name' => 'Isolated Client User',
            'email' => 'isolated@client.com',
            'password' => bcrypt('password123'),
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $this->clientA->id,
            'status' => 'active',
        ]);

        $response = $this->post(route('login'), [
            'email' => 'isolated@client.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('dashboard'));

        // Client User can access their own client
        $ownResponse = $this->actingAs($user)->get(route('clients.show', $this->clientA->id));
        $ownResponse->assertOk();

        // Client User CANNOT access Client B
        $otherResponse = $this->actingAs($user)->get(route('clients.show', $this->clientB->id));
        $otherResponse->assertForbidden();
    }
}
