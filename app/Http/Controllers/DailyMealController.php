<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveDailyMealsRequest;
use App\Models\Client;
use App\Models\DailyMealConfirmation;
use App\Models\DailyMenu;
use App\Models\Employee;
use App\Models\MealEntry;
use App\Services\MealCutoffService;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DailyMealController extends Controller
{
    /**
     * Display today's daily meal overview hub.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $today = Carbon::today()->format('Y-m-d');

        // Client admin redirects straight to roster for their organization
        if ($user->isClientAdmin()) {
            return redirect()->route('daily-meals.roster', [
                'client_id' => $user->client_id,
                'date' => $today,
                'meal_type' => 'Lunch',
            ]);
        }

        // Vendor Admin / Staff overview
        $clients = Client::active()->orderBy('name')->get();

        $clientStatuses = $clients->map(function ($client) use ($today) {
            $lunchCount = MealEntry::where('client_id', $client->id)
                ->where('date', $today)
                ->where('meal_type', 'Lunch')
                ->where('status', MealEntry::STATUS_CONSUMED)
                ->count();

            $dinnerCount = MealEntry::where('client_id', $client->id)
                ->where('date', $today)
                ->where('meal_type', 'Dinner')
                ->where('status', MealEntry::STATUS_CONSUMED)
                ->count();

            $lunchRate = PricingService::getMealPrice($client, 'Lunch', $today);
            $dinnerRate = PricingService::getMealPrice($client, 'Dinner', $today);

            $lunchCutoff = MealCutoffService::isCutoffPassed($client, 'Lunch', $today);
            $dinnerCutoff = MealCutoffService::isCutoffPassed($client, 'Dinner', $today);

            return [
                'client' => $client,
                'lunch_count' => $lunchCount,
                'dinner_count' => $dinnerCount,
                'total_meals' => $lunchCount + $dinnerCount,
                'total_amount' => round(($lunchCount * $lunchRate) + ($dinnerCount * $dinnerRate), 2),
                'lunch_rate' => $lunchRate,
                'dinner_rate' => $dinnerRate,
                'lunch_cutoff_passed' => $lunchCutoff,
                'dinner_cutoff_passed' => $dinnerCutoff,
            ];
        });

        $totalLunchToday = MealEntry::where('date', $today)
            ->where('meal_type', 'Lunch')
            ->where('status', MealEntry::STATUS_CONSUMED)
            ->count();

        $totalDinnerToday = MealEntry::where('date', $today)
            ->where('meal_type', 'Dinner')
            ->where('status', MealEntry::STATUS_CONSUMED)
            ->count();

        $stats = [
            'total_clients' => $clients->count(),
            'total_lunch_today' => $totalLunchToday,
            'total_dinner_today' => $totalDinnerToday,
            'total_meals_today' => $totalLunchToday + $totalDinnerToday,
            'date_formatted' => Carbon::today()->format('l, F j, Y'),
        ];

        return Inertia::render('DailyMeals/Index', [
            'clientStatuses' => $clientStatuses,
            'stats' => $stats,
            'today' => $today,
        ]);
    }

    /**
     * Interactive Daily Meal Roster for marking YES/NO attendance.
     */
    public function roster(Request $request): Response
    {
        $user = $request->user();
        $date = $request->input('date', Carbon::today()->format('Y-m-d'));
        $mealType = ucfirst(strtolower($request->input('meal_type', 'Lunch')));

        if (! in_array($mealType, ['Lunch', 'Dinner'], true)) {
            $mealType = 'Lunch';
        }

        // Determine target client
        if ($user->isClientAdmin()) {
            $clientId = $user->client_id;
        } else {
            $clientId = $request->input('client_id');
            if (empty($clientId)) {
                $firstClient = Client::active()->first();
                $clientId = $firstClient ? $firstClient->id : null;
            }
        }

        $client = $clientId ? Client::findOrFail($clientId) : null;

        // Authorization check
        if ($client) {
            $this->authorize('manage', [MealEntry::class, $client]);
        }

        $clients = $user->isClientAdmin()
            ? []
            : Client::active()->select('id', 'name')->orderBy('name')->get();

        $employees = [];
        $existingEntries = [];
        $cutoffInfo = [
            'allowed' => true,
            'is_cutoff' => false,
            'is_override' => false,
            'reason' => null,
            'cutoff_time' => '10:00 AM',
        ];
        $unitPrice = 0.00;
        $todaysMenu = null;

        if ($client) {
            // Cutoff check
            $cutoffCheck = MealCutoffService::checkPermissions($user, $client, $mealType, $date);
            $cutoffInfo = array_merge($cutoffCheck, [
                'cutoff_time' => MealCutoffService::getCutoffTime($client, $mealType),
            ]);

            // Effective rate
            $unitPrice = PricingService::getMealPrice($client, $mealType, $date);

            // Fetch enrolled employees for this client
            $employees = Employee::where('client_id', $client->id)
                ->where('status', 'active')
                ->orderBy('name')
                ->get()
                ->map(function ($emp) use ($mealType) {
                    $isDefaultEnabled = $mealType === 'Lunch' ? $emp->lunch_enabled : $emp->dinner_enabled;
                    return [
                        'id' => $emp->id,
                        'name' => $emp->name,
                        'employee_id' => $emp->employee_id,
                        'department' => $emp->department,
                        'designation' => $emp->designation,
                        'meal_preference' => $emp->meal_preference,
                        'dietary_notes' => $emp->dietary_notes,
                        'default_enabled' => (bool) $isDefaultEnabled,
                    ];
                });

            // Fetch existing recorded entries for this date + shift
            $existingEntries = MealEntry::where('client_id', $client->id)
                ->where('date', $date)
                ->where('meal_type', $mealType)
                ->get()
                ->keyBy('employee_id')
                ->map(fn ($entry) => [
                    'status' => $entry->status,
                    'notes' => $entry->notes,
                    'unit_price' => $entry->unit_price,
                ]);

            // Fetch today's menu for display context
            $todaysMenu = DailyMenu::with('items.menuItem')
                ->where(function ($q) use ($client) {
                    $q->where('client_id', $client->id)->orWhereNull('client_id');
                })
                ->where('date', $date)
                ->where('meal_type', $mealType)
                ->where('is_published', true)
                ->orderByRaw('client_id IS NULL ASC') // prioritize client-specific
                ->first();
        }

        return Inertia::render('DailyMeals/Roster', [
            'client' => $client,
            'clients' => $clients,
            'date' => $date,
            'mealType' => $mealType,
            'employees' => $employees,
            'existingEntries' => $existingEntries,
            'cutoffInfo' => $cutoffInfo,
            'unitPrice' => $unitPrice,
            'todaysMenu' => $todaysMenu,
            'isClientAdmin' => $user->isClientAdmin(),
            'isVendorAdmin' => $user->isVendorAdmin(),
        ]);
    }

    /**
     * Store and commit daily meal confirmation entries.
     */
    public function store(SaveDailyMealsRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $client = Client::findOrFail($data['client_id']);
        $this->authorize('manage', [MealEntry::class, $client]);

        // Cutoff evaluation
        $cutoffCheck = MealCutoffService::checkPermissions($user, $client, $data['meal_type'], $data['date']);
        if (! $cutoffCheck['allowed']) {
            return back()->with('error', $cutoffCheck['reason']);
        }

        $unitPrice = PricingService::getMealPrice($client, $data['meal_type'], $data['date']);
        $consumedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($data['entries'] as $entryData) {
                $employeeId = $entryData['employee_id'];
                $isPresent = (bool) $entryData['is_present'];
                $notes = $entryData['notes'] ?? null;

                if ($isPresent) {
                    $consumedCount++;
                    MealEntry::updateOrCreate(
                        [
                            'employee_id' => $employeeId,
                            'date' => $data['date'],
                            'meal_type' => $data['meal_type'],
                        ],
                        [
                            'client_id' => $client->id,
                            'status' => MealEntry::STATUS_CONSUMED,
                            'unit_price' => $unitPrice,
                            'total_price' => $unitPrice,
                            'is_overridden' => $cutoffCheck['is_override'],
                            'overridden_by' => $cutoffCheck['is_override'] ? $user->id : null,
                            'notes' => $notes,
                        ]
                    );
                } else {
                    // If previously marked as consumed, update to cancelled or delete
                    $existing = MealEntry::where('employee_id', $employeeId)
                        ->where('date', $data['date'])
                        ->where('meal_type', $data['meal_type'])
                        ->first();

                    if ($existing) {
                        $existing->update([
                            'status' => MealEntry::STATUS_CANCELLED,
                            'total_price' => 0.00,
                        ]);
                    }
                }
            }

            $totalAmount = round($consumedCount * $unitPrice, 2);

            // Record or update batch confirmation log
            DailyMealConfirmation::updateOrCreate(
                [
                    'client_id' => $client->id,
                    'date' => $data['date'],
                    'meal_type' => $data['meal_type'],
                ],
                [
                    'total_count' => $consumedCount,
                    'unit_price' => $unitPrice,
                    'total_amount' => $totalAmount,
                    'status' => 'confirmed',
                    'confirmed_by' => $user->id,
                    'confirmed_at' => now(),
                    'is_cutoff_overridden' => $cutoffCheck['is_override'],
                ]
            );

            DB::commit();

            $formattedDate = Carbon::parse($data['date'])->format('M d, Y');
            return back()->with(
                'success',
                "Successfully confirmed {$consumedCount} {$data['meal_type']} meals for {$client->name} on {$formattedDate} (Total: ৳" . number_format($totalAmount, 2) . ')'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to confirm meals: ' . $e->getMessage());
        }
    }
}
