<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Client;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees with client isolation and filters.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        $user = $request->user();
        $isClientAdmin = $user->isClientAdmin();

        // Enforce strict client isolation: Client Admin cannot change target client_id
        $clientId = $isClientAdmin ? $user->client_id : $request->input('client_id');
        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $department = $request->input('department', 'all');
        $mealPreference = $request->input('meal_preference', 'all');

        $query = Employee::query()
            ->with('client:id,name,city')
            ->search($search)
            ->filterStatus($status)
            ->filterDepartment($department)
            ->filterMealPreference($mealPreference);

        if (! empty($clientId) && $clientId !== 'all') {
            $query->where('client_id', (int) $clientId);
        }

        $employees = $query->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        // Distinct departments for filter dropdown
        $departmentsQuery = Employee::query()->whereNotNull('department')->where('department', '!=', '');
        if ($isClientAdmin) {
            $departmentsQuery->where('client_id', $user->client_id);
        }
        $departments = $departmentsQuery->distinct()->pluck('department');

        // Client options for filter (vendor only)
        $clients = $isClientAdmin
            ? []
            : Client::query()->select('id', 'name')->orderBy('name')->get();

        $metricsQuery = Employee::query();
        if ($isClientAdmin) {
            $metricsQuery->where('client_id', $user->client_id);
        } elseif (! empty($clientId) && $clientId !== 'all') {
            $metricsQuery->where('client_id', (int) $clientId);
        }

        $metrics = [
            'total' => (clone $metricsQuery)->count(),
            'active' => (clone $metricsQuery)->where('status', 'active')->count(),
            'lunch_enabled' => (clone $metricsQuery)->where('lunch_enabled', true)->count(),
            'dinner_enabled' => (clone $metricsQuery)->where('dinner_enabled', true)->count(),
        ];

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'clients' => $clients,
            'departments' => $departments,
            'mealPreferences' => Employee::MEAL_PREFERENCES,
            'filters' => [
                'client_id' => $isClientAdmin ? (string) $user->client_id : ($clientId ?: 'all'),
                'search' => $search,
                'status' => $status,
                'department' => $department,
                'meal_preference' => $mealPreference,
            ],
            'metrics' => $metrics,
            'isClientAdmin' => $isClientAdmin,
            'userClientId' => $user->client_id,
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', Employee::class);

        $user = $request->user();
        $isClientAdmin = $user->isClientAdmin();

        $clients = $isClientAdmin
            ? Client::query()->where('id', $user->client_id)->select('id', 'name')->get()
            : Client::query()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Employees/Create', [
            'clients' => $clients,
            'defaultClientId' => $isClientAdmin ? $user->client_id : (int) $request->input('client_id'),
            'mealPreferences' => Employee::MEAL_PREFERENCES,
            'isClientAdmin' => $isClientAdmin,
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $this->authorize('create', Employee::class);

        $employee = DB::transaction(function () use ($request) {
            $data = $request->validated();
            $emp = Employee::create($data);
            $emp->client->syncEmployeeCount();
            return $emp;
        });

        return redirect()->route('employees.show', $employee->id)
            ->with('success', "Employee '{$employee->name}' ({$employee->employee_id}) added successfully.");
    }

    /**
     * Display the specified employee details.
     */
    public function show(Request $request, Employee $employee): Response
    {
        $this->authorize('view', $employee);

        $employee->load('client');

        // Recent meal activity summary placeholder
        $mealSummary = [
            'this_month_lunch' => 18,
            'this_month_dinner' => $employee->dinner_enabled ? 4 : 0,
            'total_meals' => $employee->dinner_enabled ? 22 : 18,
            'last_meal_date' => date('Y-m-d'),
        ];

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'mealSummary' => $mealSummary,
            'canEdit' => $request->user()->can('update', $employee),
            'canDelete' => $request->user()->can('delete', $employee),
        ]);
    }

    /**
     * Show the form for editing the employee.
     */
    public function edit(Request $request, Employee $employee): Response
    {
        $this->authorize('update', $employee);

        $user = $request->user();
        $isClientAdmin = $user->isClientAdmin();

        $clients = $isClientAdmin
            ? Client::query()->where('id', $employee->client_id)->select('id', 'name')->get()
            : Client::query()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'clients' => $clients,
            'mealPreferences' => Employee::MEAL_PREFERENCES,
            'isClientAdmin' => $isClientAdmin,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $this->authorize('update', $employee);

        DB::transaction(function () use ($request, $employee) {
            $data = $request->validated();
            $employee->update($data);
            $employee->client->syncEmployeeCount();
        });

        return redirect()->route('employees.show', $employee->id)
            ->with('success', "Employee '{$employee->name}' updated successfully.");
    }

    /**
     * Quick toggle employee status.
     */
    public function toggleStatus(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorize('update', $employee);

        $newStatus = $employee->status === 'active' ? 'inactive' : 'active';
        $employee->update(['status' => $newStatus]);

        return back()->with('success', "Employee status marked as {$newStatus}.");
    }

    /**
     * Soft delete the employee.
     */
    public function destroy(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorize('delete', $employee);

        $client = $employee->client;
        $name = $employee->name;
        $employee->delete();
        $client->syncEmployeeCount();

        return redirect()->route('employees.index')
            ->with('success', "Employee '{$name}' removed and moved to archive.");
    }
}
