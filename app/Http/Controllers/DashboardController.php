<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard shell.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $vendorProfile = VendorProfile::current();

        $isClientAdmin = $user->isClientAdmin();

        if ($isClientAdmin && $user->client_id) {
            $client = Client::find($user->client_id);
            $totalEmployees = $client ? $client->number_of_employees : 0;
            $todayMeals = (int) round($totalEmployees * 0.8);
            $todayRevenue = round($todayMeals * 120, 2);

            $stats = [
                'total_clients' => [
                    'label' => 'Client Office',
                    'value' => 1,
                    'formatted' => $client ? $client->name : 'My Office',
                    'subtitle' => 'Enrolled corporate client',
                    'change' => 'Active Contract',
                    'isPositive' => true,
                ],
                'total_employees' => [
                    'label' => 'Total Employees',
                    'value' => $totalEmployees,
                    'subtitle' => 'Enrolled office members',
                    'change' => 'Active staff',
                    'isPositive' => true,
                ],
                'today_meals' => [
                    'label' => "Today's Meals",
                    'value' => $todayMeals,
                    'subtitle' => 'Confirmed count',
                    'change' => 'Scheduled lunch',
                    'isPositive' => true,
                ],
                'today_revenue' => [
                    'label' => "Current Est. Cost",
                    'value' => $todayRevenue,
                    'formatted' => '৳ ' . number_format($todayRevenue),
                    'subtitle' => 'Standard tier (৳120)',
                    'change' => 'Daily estimate',
                    'isPositive' => true,
                ],
                'pending_deliveries' => [
                    'label' => 'Today Delivery',
                    'value' => 1,
                    'subtitle' => 'Lunch slot 12:45 PM',
                    'change' => 'On schedule',
                    'isPositive' => true,
                ],
            ];

            $clientOverview = $client ? [
                [
                    'id' => $client->id,
                    'name' => $client->name,
                    'employees' => $client->number_of_employees,
                    'today_meals' => $todayMeals,
                    'lunch_time' => $client->lunch_cutoff_time ? date('g:i A', strtotime($client->lunch_cutoff_time)) : '1:00 PM',
                    'status' => 'Preparing',
                ]
            ] : [];
        } else {
            $clientCount = Client::count();
            $totalEmployees = Client::sum('number_of_employees');
            $todayMeals = (int) round($totalEmployees * 0.75);
            $todayRevenue = round($todayMeals * 120, 2);

            $stats = [
                'total_clients' => [
                    'label' => 'Total Clients',
                    'value' => $clientCount ?: 4,
                    'subtitle' => 'Active corporate offices',
                    'change' => "+{$clientCount} enrolled",
                    'isPositive' => true,
                ],
                'total_employees' => [
                    'label' => 'Total Employees',
                    'value' => $totalEmployees ?: 128,
                    'subtitle' => 'Enrolled across all offices',
                    'change' => 'Staff headcount',
                    'isPositive' => true,
                ],
                'today_meals' => [
                    'label' => "Today's Meals",
                    'value' => $todayMeals ?: 96,
                    'subtitle' => '74 Lunch · 22 Dinner',
                    'change' => 'Confirmed count',
                    'isPositive' => true,
                ],
                'today_revenue' => [
                    'label' => "Today's Revenue",
                    'value' => $todayRevenue ?: 11520.00,
                    'formatted' => '৳ ' . number_format($todayRevenue ?: 11520),
                    'subtitle' => 'Average ৳120 / meal',
                    'change' => "{$todayMeals} billed meals",
                    'isPositive' => true,
                ],
                'pending_deliveries' => [
                    'label' => 'Pending Deliveries',
                    'value' => 3,
                    'subtitle' => '2 En Route · 1 Ready',
                    'change' => 'Next slot 12:45 PM',
                    'isPositive' => false,
                ],
            ];

            $clients = Client::all();
            $clientOverview = $clients->map(function ($client) {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'employees' => $client->number_of_employees,
                    'today_meals' => (int) round($client->number_of_employees * 0.8),
                    'lunch_time' => $client->lunch_cutoff_time ? date('g:i A', strtotime($client->lunch_cutoff_time)) : '1:00 PM',
                    'status' => 'Preparing',
                ];
            })->toArray();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'clientOverview' => $clientOverview,
            'vendor' => $vendorProfile,
            'role' => $user->role,
        ]);
    }
}
