<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\MealEntry;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MealCalendarController extends Controller
{
    /**
     * Display meal activity calendar by month.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $monthStr = $request->input('month', Carbon::today()->format('Y-m'));
        try {
            $monthStart = Carbon::createFromFormat('Y-m', $monthStr)->startOfMonth();
        } catch (\Throwable) {
            $monthStart = Carbon::today()->startOfMonth();
            $monthStr = $monthStart->format('Y-m');
        }

        $monthEnd = (clone $monthStart)->endOfMonth();

        $query = MealEntry::whereBetween('date', [$monthStart->format('Y-m-d'), $monthEnd->format('Y-m-d')])
            ->where('status', MealEntry::STATUS_CONSUMED);

        if ($user->isClientAdmin()) {
            $clientId = $user->client_id;
            $query->where('client_id', $clientId);
        } else {
            $clientId = $request->input('client_id');
            if ($clientId && $clientId !== 'all') {
                $query->where('client_id', $clientId);
            }
        }

        $entries = $query->selectRaw('date, meal_type, COUNT(*) as count, SUM(total_price) as total_amount')
            ->groupBy('date', 'meal_type')
            ->get();

        // Organize into days dictionary
        $daysData = [];
        $totalMonthMeals = 0;
        $totalMonthAmount = 0.00;

        foreach ($entries as $entry) {
            $d = $entry->date->format('Y-m-d');
            if (! isset($daysData[$d])) {
                $daysData[$d] = [
                    'date' => $d,
                    'lunch_count' => 0,
                    'dinner_count' => 0,
                    'total_meals' => 0,
                    'total_amount' => 0.00,
                ];
            }

            if ($entry->meal_type === 'Lunch') {
                $daysData[$d]['lunch_count'] = (int) $entry->count;
            } else {
                $daysData[$d]['dinner_count'] = (int) $entry->count;
            }

            $daysData[$d]['total_meals'] += (int) $entry->count;
            $daysData[$d]['total_amount'] += (float) $entry->total_amount;

            $totalMonthMeals += (int) $entry->count;
            $totalMonthAmount += (float) $entry->total_amount;
        }

        $clients = $user->isClientAdmin()
            ? []
            : Client::active()->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DailyMeals/Calendar', [
            'month' => $monthStr,
            'monthLabel' => $monthStart->format('F Y'),
            'prevMonth' => (clone $monthStart)->subMonth()->format('Y-m'),
            'nextMonth' => (clone $monthStart)->addMonth()->format('Y-m'),
            'daysData' => $daysData,
            'totalMonthMeals' => $totalMonthMeals,
            'totalMonthAmount' => round($totalMonthAmount, 2),
            'clients' => $clients,
            'selectedClientId' => $clientId ?: 'all',
            'isClientAdmin' => $user->isClientAdmin(),
        ]);
    }
}
