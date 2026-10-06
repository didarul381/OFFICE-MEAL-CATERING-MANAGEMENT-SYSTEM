<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $vendorAdmin;
    protected User $vendorStaff;
    protected User $clientAdminA;
    protected User $clientAdminB;
    protected User $rider;
    protected Client $clientA;
    protected Client $clientB;
    protected Employee $employeeA;
    protected Employee $employeeB;

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
            'name' => 'Alpha Tech Ltd.',
            'contact_person' => 'Alpha Contact',
            'phone' => '+880 1711-111111',
            'email' => 'alpha@test.com',
            'address' => 'Gulshan 1',
            'city' => 'Dhaka',
            'status' => 'active',
        ]);

        $this->clientB = Client::create([
            'name' => 'Beta Logistics Ltd.',
            'contact_person' => 'Beta Contact',
            'phone' => '+880 1811-222222',
            'email' => 'beta@test.com',
            'address' => 'Banani',
            'city' => 'Dhaka',
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

        $this->rider = User::factory()->create([
            'role' => User::ROLE_RIDER,
            'status' => 'active',
        ]);

        $this->employeeA = Employee::create([
            'client_id' => $this->clientA->id,
            'name' => 'Alice Johnson',
            'employee_id' => 'EMP-001',
            'phone' => '+880 1711-333333',
            'email' => 'alice@alpha.com',
            'department' => 'Engineering',
            'designation' => 'Software Engineer',
            'meal_preference' => 'Vegetarian',
            'lunch_enabled' => true,
            'dinner_enabled' => false,
            'status' => 'active',
        ]);

        $this->employeeB = Employee::create([
            'client_id' => $this->clientB->id,
            'name' => 'Bob Smith',
            'employee_id' => 'EMP-001', // Notice same ID as Alice, but in Client B!
            'phone' => '+880 1811-444444',
            'email' => 'bob@beta.com',
            'department' => 'Marketing',
            'designation' => 'Marketing Manager',
            'meal_preference' => 'Standard',
            'lunch_enabled' => true,
            'dinner_enabled' => true,
            'status' => 'active',
        ]);

        $this->clientA->syncEmployeeCount();
        $this->clientB->syncEmployeeCount();
    }

    public function test_vendor_admin_can_view_all_employees(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('employees.index'));

        $response->assertOk();
        $response->assertSee('Alice Johnson');
        $response->assertSee('Bob Smith');
    }

    public function test_vendor_staff_can_view_employees(): void
    {
        $response = $this->actingAs($this->vendorStaff)->get(route('employees.index'));

        $response->assertOk();
    }

    public function test_client_admin_sees_only_own_organization_employees(): void
    {
        $response = $this->actingAs($this->clientAdminA)->get(route('employees.index'));

        $response->assertOk();
        $response->assertSee('Alice Johnson');
        $response->assertDontSee('Bob Smith');
    }

    public function test_rider_cannot_access_employees(): void
    {
        $response = $this->actingAs($this->rider)->get(route('employees.index'));

        $response->assertForbidden();
    }

    public function test_vendor_admin_can_create_employee(): void
    {
        $data = [
            'client_id' => $this->clientA->id,
            'name' => 'Charlie Brown',
            'employee_id' => 'EMP-002',
            'phone' => '+880 1711-555555',
            'email' => 'charlie@alpha.com',
            'department' => 'Operations',
            'designation' => 'Executive',
            'meal_preference' => 'Halal',
            'lunch_enabled' => true,
            'dinner_enabled' => false,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->vendorAdmin)->post(route('employees.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientA->id,
            'name' => 'Charlie Brown',
            'employee_id' => 'EMP-002',
        ]);

        $this->assertEquals(2, $this->clientA->fresh()->number_of_employees);
    }

    public function test_duplicate_employee_id_in_same_client_is_rejected(): void
    {
        $data = [
            'client_id' => $this->clientA->id,
            'name' => 'Duplicate ID Person',
            'employee_id' => 'EMP-001', // already exists for clientA
            'meal_preference' => 'Standard',
            'lunch_enabled' => true,
            'dinner_enabled' => false,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->vendorAdmin)->post(route('employees.store'), $data);

        $response->assertSessionHasErrors(['employee_id']);
    }

    public function test_same_employee_id_in_different_client_is_allowed(): void
    {
        // Client A already has EMP-001 (Alice). Client B can also have EMP-001 (Bob).
        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientA->id,
            'employee_id' => 'EMP-001',
        ]);
        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientB->id,
            'employee_id' => 'EMP-001',
        ]);
    }

    public function test_client_admin_creates_employee_strictly_for_their_own_organization(): void
    {
        $data = [
            'client_id' => $this->clientB->id, // Maliciously sending Client B's id
            'name' => 'David Lee',
            'employee_id' => 'EMP-003',
            'meal_preference' => 'Standard',
            'lunch_enabled' => true,
            'dinner_enabled' => false,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->clientAdminA)->post(route('employees.store'), $data);

        $response->assertRedirect();

        // Must be saved under Client A, NEVER Client B!
        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientA->id,
            'name' => 'David Lee',
            'employee_id' => 'EMP-003',
        ]);

        $this->assertDatabaseMissing('employees', [
            'client_id' => $this->clientB->id,
            'name' => 'David Lee',
        ]);
    }

    public function test_client_admin_cannot_view_or_edit_other_clients_employee(): void
    {
        // Client Admin A tries to view Client B's employee
        $viewResponse = $this->actingAs($this->clientAdminA)->get(route('employees.show', $this->employeeB->id));
        $viewResponse->assertForbidden();

        // Client Admin A tries to edit Client B's employee
        $editResponse = $this->actingAs($this->clientAdminA)->get(route('employees.edit', $this->employeeB->id));
        $editResponse->assertForbidden();

        // Client Admin A tries to delete Client B's employee
        $deleteResponse = $this->actingAs($this->clientAdminA)->delete(route('employees.destroy', $this->employeeB->id));
        $deleteResponse->assertForbidden();
    }

    public function test_vendor_admin_can_update_and_toggle_employee_status(): void
    {
        $updateData = [
            'client_id' => $this->clientA->id,
            'name' => 'Alice Johnson Updated',
            'employee_id' => 'EMP-001',
            'meal_preference' => 'Vegetarian',
            'lunch_enabled' => true,
            'dinner_enabled' => true,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->vendorAdmin)->put(route('employees.update', $this->employeeA->id), $updateData);
        $response->assertRedirect(route('employees.show', $this->employeeA->id));

        $this->assertEquals('Alice Johnson Updated', $this->employeeA->fresh()->name);
        $this->assertTrue($this->employeeA->fresh()->dinner_enabled);

        // Toggle status
        $toggleResponse = $this->actingAs($this->vendorAdmin)->post(route('employees.toggle-status', $this->employeeA->id));
        $toggleResponse->assertRedirect();
        $this->assertEquals('inactive', $this->employeeA->fresh()->status);
    }

    public function test_vendor_admin_can_soft_delete_employee(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->delete(route('employees.destroy', $this->employeeA->id));

        $response->assertRedirect(route('employees.index'));
        $this->assertSoftDeleted('employees', ['id' => $this->employeeA->id]);
        $this->assertEquals(0, $this->clientA->fresh()->number_of_employees);
    }

    public function test_employee_search_and_filters(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('employees.index', [
            'search' => 'Alice',
            'department' => 'Engineering',
            'meal_preference' => 'Vegetarian',
        ]));

        $response->assertOk();
    }

    public function test_bulk_csv_import_creates_employees_and_handles_duplicates(): void
    {
        $csvContent = implode("\n", [
            'name,employee_id,phone,email,department,designation,meal_preference,lunch_enabled,dinner_enabled',
            'John Doe,EMP-100,+880 1711-888888,john@alpha.com,Engineering,Developer,Standard,1,0',
            'Jane Roe,EMP-101,+880 1811-999999,jane@alpha.com,Design,Designer,Vegetarian,1,1',
            'Duplicate Person,EMP-001,+880 1911-000000,dup@alpha.com,Operations,Lead,Standard,1,0', // Duplicate of existing EMP-001
            'Missing ID,,+880 1711-222222,noid@alpha.com,HR,Executive,Standard,1,0', // Missing ID
            'Bad Meal,EMP-102,+880 1711-333333,bad@alpha.com,HR,Executive,Keto,1,0', // Invalid meal preference
        ]);

        $file = UploadedFile::fake()->createWithContent('employees.csv', $csvContent);

        $response = $this->actingAs($this->vendorAdmin)->post(route('employees.import'), [
            'client_id' => $this->clientA->id,
            'csv_file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('importReport');

        $report = session('importReport');
        $this->assertEquals(2, $report['successful']); // John Doe and Jane Roe
        $this->assertEquals(1, $report['duplicates']); // EMP-001 duplicate
        $this->assertEquals(2, $report['failed']);     // Missing ID and Bad Meal

        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientA->id,
            'employee_id' => 'EMP-100',
            'name' => 'John Doe',
        ]);

        $this->assertDatabaseHas('employees', [
            'client_id' => $this->clientA->id,
            'employee_id' => 'EMP-101',
            'name' => 'Jane Roe',
        ]);
    }

    public function test_sample_csv_download_returns_stream(): void
    {
        $response = $this->actingAs($this->vendorAdmin)->get(route('employees.sample-csv'));

        $response->assertOk();
        $this->assertTrue(str_contains($response->headers->get('content-disposition'), 'employee_import_template.csv'));
    }
}
