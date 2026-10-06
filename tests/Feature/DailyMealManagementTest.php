<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\DailyMealConfirmation;
use App\Models\Employee;
use App\Models\MealEntry;
use App\Models\User;
use App\Services\MealCutoffService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DailyMealManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $vendorAdmin;
    protected User $clientAdminA;
    protected User $clientAdminB;
    protected Client $clientA;
    protected Client $clientB;
    protected Employee $empA1;
    protected Employee $empA2;
    protected Employee $empB1;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create Clients
        $this->clientA = Client::create([
            'name' => 'Acme Technologies',
            'contact_person' => 'Alice HR',
            'phone' => '+880 1711-123456',
            'email' => 'alice@acme.com',
            'address' => 'Gulshan 2, Dhaka',
            'city' => 'Dhaka',
            'lunch_rate' => 120.00,
            'dinner_rate' => 140.00,
            'lunch_cutoff_time' => '10:00',
            'dinner_cutoff_time' => '16:00',
            'status' => 'active',
        ]);

        $this->clientB = Client::create([
            'name' => 'Zenith Logistics',
            'contact_person' => 'Bob Manager',
            'phone' => '+880 1711-654321',
            'email' => 'bob@zenith.com',
            'address' => 'Banani, Dhaka',
            'city' => 'Dhaka',
            'lunch_rate' => 135.00,
            'dinner_rate' => 155.00,
            'lunch_cutoff_time' => '10:00',
            'dinner_cutoff_time' => '16:00',
            'status' => 'active',
        ]);

        // 2. Create Users
        $this->vendorAdmin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'client_id' => null,
            'status' => 'active',
        ]);

        $this->clientAdminA = User::factory()->create([
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $this->clientA->id,
            'status' => 'active',
        ]);

        $this->clientAdminB = User::factory()->create([
            'role' => User::ROLE_CLIENT_ADMIN,
            'client_id' => $this->clientB->id,
            'status' => 'active',
        ]);

        // 3. Create Employees
        $this->empA1 = Employee::create([
            'client_id' => $this->clientA->id,
            'name' => 'John Doe',
            'employee_id' => 'ACM-001',
            'lunch_enabled' => true,
            'dinner_enabled' => false,
            'status' => 'active',
        ]);

        $this->empA2 = Employee::create([
            'client_id' => $this->clientA->id,
            'name' => 'Jane Smith',
            'employee_id' => 'ACM-002',
            'lunch_enabled' => true,
            'dinner_enabled' => true,
            'status' => 'active',
        ]);

        $this->empB1 = Employee::create([
            'client_id' => $this->clientB->id,
            'name' => 'Robert Paulson',
            'employee_id' => 'ZEN-001',
            'lunch_enabled' => true,
            'dinner_enabled' => true,
            'status' => 'active',
        ]);
    }

    public function test_vendor_admin_can_view_daily_meals_index_hub(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('daily-meals.index'));
        $response->assertOk();
    }

    public function test_client_admin_accessing_daily_meals_redirects_to_their_roster(): void
    {
        $response = $this->actingAs($this->clientAdminA)->get(route('daily-meals.index'));
        $response->assertRedirect(route('daily-meals.roster', [
            'client_id' => $this->clientA->id,
            'date' => Carbon::today()->format('Y-m-d'),
            'meal_type' => 'Lunch',
        ]));
    }

    public function test_can_render_daily_meal_roster(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('daily-meals.roster', [
            'client_id' => $this->clientA->id,
            'date' => Carbon::today()->format('Y-m-d'),
            'meal_type' => 'Lunch',
        ]));

        $response->assertOk();
    }

    public function test_saving_daily_meal_roster_creates_meal_entries_and_confirmation(): void
    {
        $tomorrow = Carbon::tomorrow()->format('Y-m-d'); // Future date so cutoff is not passed

        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-meals.store'), [
            'client_id' => $this->clientA->id,
            'date' => $tomorrow,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empA1->id, 'is_present' => true],
                ['employee_id' => $this->empA2->id, 'is_present' => true],
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Verify entries created with client A lunch rate 120.00
        $this->assertDatabaseHas('meal_entries', [
            'client_id' => $this->clientA->id,
            'employee_id' => $this->empA1->id,
            'date' => $tomorrow,
            'meal_type' => 'Lunch',
            'status' => 'consumed',
            'unit_price' => 120.00,
            'total_price' => 120.00,
        ]);

        $this->assertDatabaseHas('meal_entries', [
            'client_id' => $this->clientA->id,
            'employee_id' => $this->empA2->id,
            'date' => $tomorrow,
            'meal_type' => 'Lunch',
            'status' => 'consumed',
            'unit_price' => 120.00,
            'total_price' => 120.00,
        ]);

        // Verify batch confirmation record
        $this->assertDatabaseHas('daily_meal_confirmations', [
            'client_id' => $this->clientA->id,
            'date' => $tomorrow,
            'meal_type' => 'Lunch',
            'total_count' => 2,
            'unit_price' => 120.00,
            'total_amount' => 240.00,
        ]);
    }

    public function test_saving_daily_meal_calculates_total_price_using_client_specific_rates(): void
    {
        $futureDate = Carbon::now()->addDays(2)->format('Y-m-d');

        // Client B has lunch_rate 135.00
        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-meals.store'), [
            'client_id' => $this->clientB->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empB1->id, 'is_present' => true],
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('daily_meal_confirmations', [
            'client_id' => $this->clientB->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'total_count' => 1,
            'unit_price' => 135.00,
            'total_amount' => 135.00,
        ]);
    }

    public function test_marking_employee_as_not_present_cancels_meal_entry(): void
    {
        $futureDate = Carbon::now()->addDays(3)->format('Y-m-d');

        // First mark as present
        MealEntry::create([
            'client_id' => $this->clientA->id,
            'employee_id' => $this->empA1->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'status' => 'consumed',
            'unit_price' => 120.00,
            'total_price' => 120.00,
        ]);

        // Submit roster with empA1 marked as not present (false)
        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-meals.store'), [
            'client_id' => $this->clientA->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empA1->id, 'is_present' => false],
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('meal_entries', [
            'employee_id' => $this->empA1->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'status' => 'cancelled',
            'total_price' => 0.00,
        ]);

        $this->assertDatabaseHas('daily_meal_confirmations', [
            'client_id' => $this->clientA->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'total_count' => 0,
            'total_amount' => 0.00,
        ]);
    }

    public function test_client_admin_cannot_modify_roster_after_cutoff(): void
    {
        // Past date is guaranteed to have passed cutoff
        $pastDate = Carbon::yesterday()->format('Y-m-d');

        $response = $this->actingAs($this->clientAdminA)->post(route('daily-meals.store'), [
            'client_id' => $this->clientA->id,
            'date' => $pastDate,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empA1->id, 'is_present' => true],
            ],
        ]);

        $response->assertSessionHas('error');
        // No meal entry created
        $this->assertDatabaseMissing('meal_entries', [
            'employee_id' => $this->empA1->id,
            'date' => $pastDate,
            'meal_type' => 'Lunch',
        ]);
    }

    public function test_vendor_admin_can_override_cutoff_and_save_roster(): void
    {
        $pastDate = Carbon::yesterday()->format('Y-m-d');

        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-meals.store'), [
            'client_id' => $this->clientA->id,
            'date' => $pastDate,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empA1->id, 'is_present' => true],
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('meal_entries', [
            'employee_id' => $this->empA1->id,
            'date' => $pastDate,
            'meal_type' => 'Lunch',
            'status' => 'consumed',
            'is_overridden' => true,
            'overridden_by' => $this->vendorAdmin->id,
        ]);
    }

    public function test_client_admin_cannot_manage_another_clients_meals(): void
    {
        $futureDate = Carbon::now()->addDays(4)->format('Y-m-d');

        // Client Admin A trying to submit meals for Client B
        $response = $this->actingAs($this->clientAdminA)->post(route('daily-meals.store'), [
            'client_id' => $this->clientB->id,
            'date' => $futureDate,
            'meal_type' => 'Lunch',
            'entries' => [
                ['employee_id' => $this->empB1->id, 'is_present' => true],
            ],
        ]);

        // prepareForValidation replaces client_id with user->client_id ($this->clientA->id)
        // Employee empB1 belongs to Client B, not Client A
        $response->assertRedirect();
        // empB1 should NOT be saved under client A or client B fraudulently
        $this->assertDatabaseMissing('meal_entries', [
            'client_id' => $this->clientB->id,
            'date' => $futureDate,
        ]);
    }

    public function test_can_view_meal_consumption_history(): void
    {
        MealEntry::create([
            'client_id' => $this->clientA->id,
            'employee_id' => $this->empA1->id,
            'date' => Carbon::today()->format('Y-m-d'),
            'meal_type' => 'Lunch',
            'status' => 'consumed',
            'unit_price' => 120.00,
            'total_price' => 120.00,
        ]);

        $response = $this->actingAs($this->vendorAdmin)->get(route('daily-meals.history'));
        $response->assertOk();
    }

    public function test_can_view_monthly_meal_calendar(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('daily-meals.calendar'));
        $response->assertOk();
    }
}
