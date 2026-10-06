<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\MealEntry;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MealHistoryController extends Controller
{
    /**
     * Display meal consumption history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = MealEntry::with(['client', 'employee', 'overriddenBy'])
            ->where('status', MealEntry::STATUS_CONSUMED);

        // Client isolation
        if ($user->isClientAdmin()) {
            $query->where('client_id', $user->client_id);
        } elseif ($request->filled('client_id') && $request->input('client_id') !== 'all') {
            $query->where('client_id', $request->input('client_id'));
        }

        if ($request->filled('meal_type') && $request->input('meal_type') !== 'all') {
            $query->where('meal_type', $request->input('meal_type'));
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->input('date_to'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%");
            });
        }

        $mealEntries = (clone $query)->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20)
            ->withQueryString();

        $clients = $user->isClientAdmin()
            ? []
            : Client::active()->select('id', 'name')->orderBy('name')->get();

        $stats = [
            'total_meals' => (clone $query)->count(),
            'total_amount' => round((clone $query)->sum('total_price'), 2),
            'unique_employees' => (clone $query)->distinct('employee_id')->count('employee_id'),
        ];

        return Inertia::render('DailyMeals/History', [
            'mealEntries' => $mealEntries,
            'clients' => $clients,
            'filters' => $request->only(['client_id', 'meal_type', 'date_from', 'date_to', 'search']),
            'stats' => $stats,
            'isClientAdmin' => $user->isClientAdmin(),
        ]);
    }
}
