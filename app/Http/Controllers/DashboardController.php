<?php

namespace App\Http\Controllers;

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

        // Milestone 01 Dashboard foundation stats
        $stats = [
            'total_clients' => [
                'label' => 'Total Clients',
                'value' => 4,
                'subtitle' => 'Active corporate offices',
                'change' => '+1 this month',
                'isPositive' => true,
            ],
            'total_employees' => [
                'label' => 'Total Employees',
                'value' => 128,
                'subtitle' => 'Enrolled across all offices',
                'change' => '+12 this week',
                'isPositive' => true,
            ],
            'today_meals' => [
                'label' => "Today's Meals",
                'value' => 96,
                'subtitle' => '74 Lunch · 22 Dinner',
                'change' => 'Confirmed count',
                'isPositive' => true,
            ],
            'today_revenue' => [
                'label' => "Today's Revenue",
                'value' => 11520.00,
                'formatted' => '৳ 11,520',
                'subtitle' => 'Average ৳120 / meal',
                'change' => '96 billed meals',
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

        // Foundational mock for milestone client highlights
        $clientOverview = [
            [
                'name' => 'XYZ Software Ltd.',
                'employees' => 45,
                'today_meals' => 38,
                'lunch_time' => '1:00 PM',
                'status' => 'Preparing',
            ],
            [
                'name' => 'ABC Bank Ltd. (Banani Branch)',
                'employees' => 32,
                'today_meals' => 28,
                'lunch_time' => '1:30 PM',
                'status' => 'On The Way',
            ],
            [
                'name' => 'Tech Solutions Ltd.',
                'employees' => 29,
                'today_meals' => 20,
                'lunch_time' => '1:15 PM',
                'status' => 'Delivered',
            ],
            [
                'name' => 'Digital Bangladesh Ltd.',
                'employees' => 22,
                'today_meals' => 10,
                'lunch_time' => '2:00 PM',
                'status' => 'Ready',
            ],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'clientOverview' => $clientOverview,
            'vendor' => $vendorProfile,
            'role' => $user->role,
        ]);
    }
}
