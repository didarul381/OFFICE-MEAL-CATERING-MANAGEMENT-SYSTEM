<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\ClientMenuPrice;
use App\Models\DailyMenu;
use App\Models\DailyMenuItem;
use App\Models\MenuItem;
use App\Models\User;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuAndPricingTest extends TestCase
{
    use RefreshDatabase;

    protected User $vendorAdmin;
    protected User $vendorStaff;
    protected User $clientAdminA;
    protected User $clientAdminB;
    protected Client $clientA;
    protected Client $clientB;
    protected MenuItem $rice;
    protected MenuItem $chicken;
    protected MenuItem $biryani;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create Clients
        $this->clientA = Client::create([
            'name' => 'Acme Corporation',
            'contact_person' => 'Alice Manager',
            'phone' => '+880 1711-111111',
            'email' => 'alice@acme.com',
            'address' => 'Plot 10, Gulshan 1',
            'city' => 'Dhaka',
            'lunch_rate' => 120.00,
            'dinner_rate' => 140.00,
            'status' => 'active',
        ]);

        $this->clientB = Client::create([
            'name' => 'Beta Solutions Ltd.',
            'contact_person' => 'Bob Director',
            'phone' => '+880 1722-222222',
            'email' => 'bob@beta.com',
            'address' => 'House 5, Road 7, Dhanmondi',
            'city' => 'Dhaka',
            'lunch_rate' => 135.00,
            'dinner_rate' => 155.00,
            'status' => 'active',
        ]);

        // 2. Create Users
        $this->vendorAdmin = User::factory()->create([
            'role' => User::ROLE_VENDOR_ADMIN,
            'client_id' => null,
            'status' => 'active',
        ]);

        $this->vendorStaff = User::factory()->create([
            'role' => User::ROLE_VENDOR_STAFF,
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

        // 3. Create Sample Menu Items
        $this->rice = MenuItem::create([
            'name' => 'Steamed Rice',
            'category' => 'Main Course',
            'default_price' => 40.00,
            'is_active' => true,
        ]);

        $this->chicken = MenuItem::create([
            'name' => 'Chicken Roast',
            'category' => 'Protein',
            'default_price' => 85.00,
            'is_active' => true,
        ]);

        $this->biryani = MenuItem::create([
            'name' => 'Special Mutton Biryani',
            'category' => 'Main Course',
            'default_price' => 220.00,
            'is_active' => true,
        ]);
    }

    public function test_vendor_admin_can_view_menu_items_index(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('menu-items.index'));
        $response->assertOk();
    }

    public function test_vendor_admin_can_create_menu_item(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->post(route('menu-items.store'), [
            'name' => 'Fresh Rui Fish Bhuna',
            'category' => 'Protein',
            'description' => 'Fresh carp fish curry.',
            'default_price' => 95.00,
            'is_active' => 1,
        ]);

        $response->assertRedirect(route('menu-items.index'));
        $this->assertDatabaseHas('menu_items', [
            'name' => 'Fresh Rui Fish Bhuna',
            'default_price' => 95.00,
        ]);
    }

    public function test_vendor_admin_can_update_menu_item(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->put(route('menu-items.update', $this->rice->id), [
            'name' => 'Premium Basmati Rice',
            'category' => 'Main Course',
            'description' => 'Upgraded to long-grain Basmati.',
            'default_price' => 50.00,
            'is_active' => 1,
        ]);

        $response->assertRedirect(route('menu-items.index'));
        $this->assertDatabaseHas('menu_items', [
            'id' => $this->rice->id,
            'name' => 'Premium Basmati Rice',
            'default_price' => 50.00,
        ]);
    }

    public function test_vendor_admin_can_toggle_menu_item_status(): void
    {
        $this->assertTrue($this->rice->is_active);

        $response = $this->actingAs($this->vendorAdmin)->post(route('menu-items.toggle-status', $this->rice->id));
        $response->assertRedirect();

        $this->assertFalse($this->rice->fresh()->is_active);
    }

    public function test_vendor_admin_can_delete_menu_item(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->delete(route('menu-items.destroy', $this->rice->id));
        $response->assertRedirect(route('menu-items.index'));

        $this->assertSoftDeleted('menu_items', ['id' => $this->rice->id]);
    }

    public function test_client_admin_cannot_create_or_modify_menu_items(): void
    {
        // Cannot create
        $createResponse = $this->actingAs($this->clientAdminA)->post(route('menu-items.store'), [
            'name' => 'Illegal Item',
            'category' => 'Main Course',
            'default_price' => 50.00,
        ]);
        $createResponse->assertForbidden();

        // Cannot update
        $updateResponse = $this->actingAs($this->clientAdminA)->put(route('menu-items.update', $this->chicken->id), [
            'name' => 'Hacked Item',
            'category' => 'Protein',
            'default_price' => 10.00,
        ]);
        $updateResponse->assertForbidden();

        // Cannot delete
        $deleteResponse = $this->actingAs($this->clientAdminA)->delete(route('menu-items.destroy', $this->chicken->id));
        $deleteResponse->assertForbidden();
    }

    public function test_vendor_admin_can_update_client_contract_pricing_and_overrides(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->put(route('client-pricing.update', $this->clientA->id), [
            'lunch_rate' => 125.00,
            'dinner_rate' => 145.00,
            'custom_prices' => [
                [
                    'menu_item_id' => $this->biryani->id,
                    'custom_price' => 195.00,
                ],
            ],
        ]);

        $response->assertRedirect(route('client-pricing.index'));

        $this->assertEquals(125.00, (float) $this->clientA->fresh()->lunch_rate);
        $this->assertEquals(145.00, (float) $this->clientA->fresh()->dinner_rate);

        $this->assertDatabaseHas('client_menu_prices', [
            'client_id' => $this->clientA->id,
            'menu_item_id' => $this->biryani->id,
            'custom_price' => 195.00,
        ]);
    }

    public function test_client_admin_can_view_own_pricing_but_cannot_modify(): void
    {
        // Can view own pricing
        $viewResponse = $this->actingAs($this->clientAdminA)->get(route('client-pricing.show', $this->clientA->id));
        $viewResponse->assertOk();

        // Cannot access edit form
        $editResponse = $this->actingAs($this->clientAdminA)->get(route('client-pricing.edit', $this->clientA->id));
        $editResponse->assertForbidden();

        // Cannot update rates
        $updateResponse = $this->actingAs($this->clientAdminA)->put(route('client-pricing.update', $this->clientA->id), [
            'lunch_rate' => 50.00,
            'dinner_rate' => 60.00,
        ]);
        $updateResponse->assertForbidden();
    }

    public function test_client_admin_cannot_view_other_client_pricing(): void
    {
        // Client A trying to see Client B pricing
        $response = $this->actingAs($this->clientAdminA)->get(route('client-pricing.show', $this->clientB->id));
        $response->assertForbidden();
    }

    public function test_pricing_service_returns_correct_client_specific_meal_prices(): void
    {
        // 1. Client A Lunch should be 120, Dinner 140
        $this->assertEquals(120.00, PricingService::getMealPrice($this->clientA, 'Lunch'));
        $this->assertEquals(140.00, PricingService::getMealPrice($this->clientA, 'Dinner'));

        // 2. Client B Lunch should be 135, Dinner 155
        $this->assertEquals(135.00, PricingService::getMealPrice($this->clientB, 'Lunch'));
        $this->assertEquals(155.00, PricingService::getMealPrice($this->clientB, 'Dinner'));

        // 3. Batch calculation: 22 lunches for Client A = 22 * 120 = 2640.00
        $this->assertEquals(2640.00, PricingService::calculateTotalCost($this->clientA, 'Lunch', 22));

        // 4. Batch calculation: 10 lunches for Client B = 10 * 135 = 1350.00
        $this->assertEquals(1350.00, PricingService::calculateTotalCost($this->clientB, 'Lunch', 10));
    }

    public function test_pricing_service_respects_custom_daily_menu_base_price(): void
    {
        $today = Carbon::today()->format('Y-m-d');

        // Create a special celebration menu for Client A with base_price 200.00
        DailyMenu::create([
            'client_id' => $this->clientA->id,
            'date' => $today,
            'meal_type' => 'Lunch',
            'title' => 'Special Feast Menu',
            'base_price' => 200.00,
            'is_published' => true,
        ]);

        // On today's date, Client A's price should be 200.00 instead of standard 120.00
        $this->assertEquals(200.00, PricingService::getMealPrice($this->clientA, 'Lunch', $today));

        // On another date without custom menu, it falls back to contract rate 120.00
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');
        $this->assertEquals(120.00, PricingService::getMealPrice($this->clientA, 'Lunch', $tomorrow));
    }

    public function test_pricing_service_returns_custom_dish_price_or_default_price(): void
    {
        // No override set for Chicken Roast -> default 85.00
        $this->assertEquals(85.00, PricingService::getItemPrice($this->clientA, $this->chicken));

        // Set override for Mutton Biryani -> 190.00 instead of 220.00
        ClientMenuPrice::create([
            'client_id' => $this->clientA->id,
            'menu_item_id' => $this->biryani->id,
            'custom_price' => 190.00,
            'is_active' => true,
        ]);

        $this->assertEquals(190.00, PricingService::getItemPrice($this->clientA, $this->biryani));
        // Client B without override still gets catalogue price 220.00
        $this->assertEquals(220.00, PricingService::getItemPrice($this->clientB, $this->biryani));
    }

    public function test_vendor_admin_can_create_daily_menu_with_items(): void
    {
        $date = Carbon::today()->format('Y-m-d');

        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-menus.store'), [
            'date' => $date,
            'meal_type' => 'Lunch',
            'client_id' => null, // Global
            'title' => 'Standard Lunch Roster',
            'base_price' => 120.00,
            'is_published' => 1,
            'items' => [
                [
                    'menu_item_id' => $this->rice->id,
                    'serving_portion' => 'Standard bowl',
                ],
                [
                    'menu_item_id' => $this->chicken->id,
                    'serving_portion' => '1 quarter leg',
                ],
            ],
        ]);

        $response->assertRedirect(route('daily-menus.index'));

        $this->assertDatabaseHas('daily_menus', [
            'date' => $date,
            'meal_type' => 'Lunch',
            'client_id' => null,
            'base_price' => 120.00,
        ]);

        $dailyMenu = DailyMenu::where('date', $date)->where('meal_type', 'Lunch')->first();
        $this->assertCount(2, $dailyMenu->items);
    }

    public function test_vendor_admin_can_duplicate_daily_menu_to_another_date(): void
    {
        $sourceDate = Carbon::today()->format('Y-m-d');
        $targetDate = Carbon::tomorrow()->format('Y-m-d');

        $menu = DailyMenu::create([
            'date' => $sourceDate,
            'meal_type' => 'Lunch',
            'title' => 'Original Menu',
            'base_price' => 120.00,
            'is_published' => true,
        ]);

        DailyMenuItem::create([
            'daily_menu_id' => $menu->id,
            'menu_item_id' => $this->rice->id,
            'serving_portion' => '1 cup',
            'sort_order' => 0,
        ]);

        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-menus.duplicate', $menu->id), [
            'target_date' => $targetDate,
            'target_meal_type' => 'Lunch',
            'target_client_id' => null,
        ]);

        $response->assertRedirect(route('daily-menus.index'));

        $this->assertDatabaseHas('daily_menus', [
            'date' => $targetDate,
            'meal_type' => 'Lunch',
            'title' => 'Original Menu',
        ]);

        $duplicatedMenu = DailyMenu::where('date', $targetDate)->where('meal_type', 'Lunch')->first();
        $this->assertCount(1, $duplicatedMenu->items);
    }

    public function test_duplicate_daily_menu_fails_if_menu_already_exists_for_target_date(): void
    {
        $sourceDate = Carbon::today()->format('Y-m-d');
        $targetDate = Carbon::tomorrow()->format('Y-m-d');

        $menu1 = DailyMenu::create([
            'date' => $sourceDate,
            'meal_type' => 'Lunch',
            'title' => 'Menu 1',
            'is_published' => true,
        ]);

        // Pre-existing menu on target date
        DailyMenu::create([
            'date' => $targetDate,
            'meal_type' => 'Lunch',
            'title' => 'Existing Menu',
            'is_published' => true,
        ]);

        $response = $this->actingAs($this->vendorAdmin)->post(route('daily-menus.duplicate', $menu1->id), [
            'target_date' => $targetDate,
            'target_meal_type' => 'Lunch',
            'target_client_id' => null,
        ]);

        $response->assertSessionHas('error');
    }

    public function test_client_admin_can_view_applicable_daily_menus(): void
    {
        $today = Carbon::today()->format('Y-m-d');

        // Global menu
        $globalMenu = DailyMenu::create([
            'date' => $today,
            'meal_type' => 'Lunch',
            'client_id' => null,
            'title' => 'Global Lunch',
            'is_published' => true,
        ]);

        // Client A specific menu
        $clientAMenu = DailyMenu::create([
            'date' => $today,
            'meal_type' => 'Dinner',
            'client_id' => $this->clientA->id,
            'title' => 'Client A Dinner',
            'is_published' => true,
        ]);

        // Client B specific menu
        $clientBMenu = DailyMenu::create([
            'date' => $today,
            'meal_type' => 'Dinner',
            'client_id' => $this->clientB->id,
            'title' => 'Client B Dinner',
            'is_published' => true,
        ]);

        // Client A can view global menu and own menu
        $this->actingAs($this->clientAdminA)->get(route('daily-menus.show', $globalMenu->id))->assertOk();
        $this->actingAs($this->clientAdminA)->get(route('daily-menus.show', $clientAMenu->id))->assertOk();

        // Client A CANNOT view Client B specific menu
        $this->actingAs($this->clientAdminA)->get(route('daily-menus.show', $clientBMenu->id))->assertForbidden();
    }
}
