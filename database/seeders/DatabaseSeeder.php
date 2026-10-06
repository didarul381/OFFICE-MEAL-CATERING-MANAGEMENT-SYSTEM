<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\ClientMenuPrice;
use App\Models\DailyMenu;
use App\Models\DailyMenuItem;
use App\Models\DailyMealConfirmation;
use App\Models\Employee;
use App\Models\MealEntry;
use App\Models\MenuItem;
use App\Models\User;
use App\Models\VendorProfile;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create or update default vendor profile
        VendorProfile::updateOrCreate(
            ['id' => 1],
            [
                'business_name' => 'ABC Catering & Food Services',
                'organization_name' => 'ABC Hospitality & Food Logistics Ltd.',
                'owner_name' => 'Rafiqul Islam',
                'phone' => '+880 1712-345678',
                'email' => 'info@abccatering.com',
                'address' => 'House 42, Road 11, Block D, Banani C/A',
                'city' => 'Dhaka',
                'business_type' => 'Corporate Meal & Catering Services',
                'vat_tin' => 'BIN-9876543210',
                'status' => 'active',
            ]
        );

        // 2. Create foundational Client Organizations (Milestone 02)
        $client1 = Client::updateOrCreate(
            ['name' => 'XYZ Software Ltd.'],
            [
                'contact_person' => 'Tanvir Ahmed',
                'phone' => '+880 1912-345680',
                'email' => 'client@office.com',
                'address' => 'Level 8, Concord Tower, 45 Gulshan Avenue',
                'city' => 'Dhaka',
                'delivery_address' => 'Level 8, Cafeteria pantry, Concord Tower, 45 Gulshan Avenue',
                'number_of_employees' => 45,
                'meal_types' => ['lunch'],
                'office_start_time' => '09:00',
                'lunch_cutoff_time' => '10:00',
                'dinner_cutoff_time' => '16:00',
                'special_instructions' => 'Please deliver hot boxes directly to 8th floor cafeteria before 12:45 PM.',
                'status' => 'active',
                'notes' => 'Priority client. Daily standard executive menu.',
            ]
        );

        $client2 = Client::updateOrCreate(
            ['name' => 'ABC Bank Ltd. (Banani Branch)'],
            [
                'contact_person' => 'Mahbub Alam',
                'phone' => '+880 1819-223344',
                'email' => 'mahbub@abcbank.com',
                'address' => 'Plot 12, Road 11, Banani Commercial Area',
                'city' => 'Dhaka',
                'delivery_address' => '2nd Floor, Operations Division, Banani',
                'number_of_employees' => 32,
                'meal_types' => ['lunch', 'dinner'],
                'office_start_time' => '09:30',
                'lunch_cutoff_time' => '10:30',
                'dinner_cutoff_time' => '16:30',
                'special_instructions' => 'Include 4 vegetarian meals every day.',
                'status' => 'active',
                'notes' => 'Contract renewed annually in January.',
            ]
        );

        $client3 = Client::updateOrCreate(
            ['name' => 'Tech Solutions Ltd.'],
            [
                'contact_person' => 'Farhana Yasmin',
                'phone' => '+880 1713-998877',
                'email' => 'farhana@techsolutions.com',
                'address' => 'House 18, Road 4, Sector 3, Uttara',
                'city' => 'Dhaka',
                'delivery_address' => 'Ground Floor Kitchenette, House 18, Road 4, Uttara',
                'number_of_employees' => 29,
                'meal_types' => ['lunch'],
                'office_start_time' => '10:00',
                'lunch_cutoff_time' => '11:00',
                'dinner_cutoff_time' => null,
                'special_instructions' => 'Contact reception security upon arrival for entry pass.',
                'status' => 'active',
                'notes' => 'Monthly consolidated invoice required by 28th.',
            ]
        );

        $client4 = Client::updateOrCreate(
            ['name' => 'Digital Bangladesh Ltd.'],
            [
                'contact_person' => 'Saif Chowdhury',
                'phone' => '+880 1611-554433',
                'email' => 'saif@digitalbd.com',
                'address' => 'BDBL Bhaban, Level 6, Karwan Bazar',
                'city' => 'Dhaka',
                'delivery_address' => 'Level 6 pantry area, BDBL Bhaban, Karwan Bazar',
                'number_of_employees' => 22,
                'meal_types' => ['lunch', 'dinner'],
                'office_start_time' => '09:00',
                'lunch_cutoff_time' => '10:00',
                'dinner_cutoff_time' => '17:00',
                'special_instructions' => 'Deliver dinner at 7:30 PM for night shift support engineers.',
                'status' => 'active',
                'notes' => 'Regular meal consumer since 2025.',
            ]
        );

        // 3. Create foundational role accounts
        $users = [
            [
                'name' => 'Rafiqul Islam (Vendor Admin)',
                'email' => 'admin@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_VENDOR_ADMIN,
                'phone' => '+880 1712-345678',
                'client_id' => null,
                'status' => 'active',
            ],
            [
                'name' => 'Kabir Hossain (Vendor Staff)',
                'email' => 'staff@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_VENDOR_STAFF,
                'phone' => '+880 1812-345679',
                'client_id' => null,
                'status' => 'active',
            ],
            [
                'name' => 'Tanvir Ahmed (Client Admin)',
                'email' => 'client@office.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_CLIENT_ADMIN,
                'phone' => '+880 1912-345680',
                'client_id' => $client1->id,
                'status' => 'active',
            ],
            [
                'name' => 'Rahim Mia (Delivery Rider)',
                'email' => 'rider@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_RIDER,
                'phone' => '+880 1612-345681',
                'client_id' => null,
                'status' => 'active',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // 4. Seed Foundational Employees for XYZ Software Ltd. (Milestone 03)
        $employeesXyz = [
            [
                'name' => 'Abdullah Al Mamun',
                'employee_id' => 'XYZ-101',
                'phone' => '+880 1711-200101',
                'email' => 'mamun@xyzsoftware.com',
                'department' => 'Engineering',
                'designation' => 'Principal Software Architect',
                'meal_preference' => 'Standard',
                'lunch_enabled' => true,
                'dinner_enabled' => false,
                'joining_date' => '2023-01-15',
            ],
            [
                'name' => 'Fatima Tuz Zohra',
                'employee_id' => 'XYZ-102',
                'phone' => '+880 1711-200102',
                'email' => 'fatima@xyzsoftware.com',
                'department' => 'Product Design',
                'designation' => 'Lead UX Researcher',
                'meal_preference' => 'Vegetarian',
                'lunch_enabled' => true,
                'dinner_enabled' => false,
                'joining_date' => '2023-04-10',
            ],
            [
                'name' => 'Shahriar Kabir',
                'employee_id' => 'XYZ-103',
                'phone' => '+880 1711-200103',
                'email' => 'shahriar@xyzsoftware.com',
                'department' => 'Engineering',
                'designation' => 'Senior Backend Engineer',
                'meal_preference' => 'Non-Veg',
                'lunch_enabled' => true,
                'dinner_enabled' => true,
                'joining_date' => '2023-06-01',
            ],
            [
                'name' => 'Nusrat Jahan',
                'employee_id' => 'XYZ-104',
                'phone' => '+880 1711-200104',
                'email' => 'nusrat@xyzsoftware.com',
                'department' => 'Quality Assurance',
                'designation' => 'QA Automation Lead',
                'meal_preference' => 'Standard',
                'lunch_enabled' => true,
                'dinner_enabled' => false,
                'joining_date' => '2024-02-12',
            ],
            [
                'name' => 'Tariqul Hasan',
                'employee_id' => 'XYZ-105',
                'phone' => '+880 1711-200105',
                'email' => 'tariq@xyzsoftware.com',
                'department' => 'DevOps',
                'designation' => 'Site Reliability Engineer',
                'meal_preference' => 'No Beef',
                'lunch_enabled' => true,
                'dinner_enabled' => true,
                'joining_date' => '2024-05-18',
            ],
        ];

        foreach ($employeesXyz as $empData) {
            Employee::updateOrCreate(
                ['client_id' => $client1->id, 'employee_id' => $empData['employee_id']],
                array_merge($empData, ['client_id' => $client1->id, 'status' => 'active'])
            );
        }

        // Seed Employees for ABC Bank Ltd.
        $employeesBank = [
            [
                'name' => 'Mahbubur Rahman',
                'employee_id' => 'BNK-201',
                'phone' => '+880 1811-300201',
                'email' => 'mahbub@abcbank.com',
                'department' => 'Branch Banking',
                'designation' => 'Senior Officer',
                'meal_preference' => 'Standard',
                'lunch_enabled' => true,
                'dinner_enabled' => true,
                'joining_date' => '2022-08-01',
            ],
            [
                'name' => 'Nazneen Akter',
                'employee_id' => 'BNK-202',
                'phone' => '+880 1811-300202',
                'email' => 'nazneen@abcbank.com',
                'department' => 'Foreign Exchange',
                'designation' => 'Assistant Vice President',
                'meal_preference' => 'Vegetarian',
                'lunch_enabled' => true,
                'dinner_enabled' => false,
                'joining_date' => '2021-11-15',
            ],
        ];

        foreach ($employeesBank as $empData) {
            Employee::updateOrCreate(
                ['client_id' => $client2->id, 'employee_id' => $empData['employee_id']],
                array_merge($empData, ['client_id' => $client2->id, 'status' => 'active'])
            );
        }

        $client1->syncEmployeeCount();
        $client2->syncEmployeeCount();

        // 5. Seed Menu Items (Milestone 04)
        $menuItems = [
            [
                'name' => 'Steamed Basmati Rice',
                'category' => 'Main Course',
                'description' => 'Aromatic long-grain steamed Basmati rice, freshly prepared.',
                'default_price' => 40.00,
                'is_active' => true,
            ],
            [
                'name' => 'Shahi Chicken Roast',
                'category' => 'Protein',
                'description' => 'Rich and spiced Mughlai style chicken quarter leg roast.',
                'default_price' => 85.00,
                'is_active' => true,
            ],
            [
                'name' => 'Traditional Beef Bhuna',
                'category' => 'Protein',
                'description' => 'Slow-cooked tender beef with aromatic roasted cumin and fried onions.',
                'default_price' => 110.00,
                'is_active' => true,
            ],
            [
                'name' => 'Rui Fish Curry with Potato',
                'category' => 'Protein',
                'description' => 'Fresh Rui fish cut cooked in traditional Bengali mustard-cumin gravy.',
                'default_price' => 90.00,
                'is_active' => true,
            ],
            [
                'name' => 'Boiled Egg Bhuna',
                'category' => 'Protein',
                'description' => 'Golden fried hard-boiled eggs in seasoned onion gravy.',
                'default_price' => 35.00,
                'is_active' => true,
            ],
            [
                'name' => 'Mixed Seasonal Vegetables (Labra)',
                'category' => 'Side Dish',
                'description' => 'Nutritious medley of seasonal vegetables cooked with five-spice temper.',
                'default_price' => 35.00,
                'is_active' => true,
            ],
            [
                'name' => 'Thick Moong Lentil Dal',
                'category' => 'Side Dish',
                'description' => 'Roasted yellow lentil soup tempered with pure ghee, cumin, and dried red chili.',
                'default_price' => 25.00,
                'is_active' => true,
            ],
            [
                'name' => 'Special Mutton Kacchi Biryani',
                'category' => 'Main Course',
                'description' => 'Authentic Old Dhaka style spiced mutton cooked dum with aromatic chinigura rice and fried potato.',
                'default_price' => 220.00,
                'is_active' => true,
            ],
            [
                'name' => 'Bhuna Khichuri',
                'category' => 'Main Course',
                'description' => 'Traditional aromatic spiced rice and moong dal khichuri.',
                'default_price' => 70.00,
                'is_active' => true,
            ],
            [
                'name' => 'Traditional Borhani',
                'category' => 'Beverage',
                'description' => 'Spiced probiotic yogurt drink made with mint, roasted cumin, and black salt.',
                'default_price' => 40.00,
                'is_active' => true,
            ],
            [
                'name' => 'Sweet Zafrani Firni',
                'category' => 'Dessert',
                'description' => 'Creamy ground rice pudding infused with saffron, cardamom, and sliced almonds.',
                'default_price' => 45.00,
                'is_active' => true,
            ],
        ];

        $createdItems = [];
        foreach ($menuItems as $item) {
            $createdItems[$item['name']] = MenuItem::updateOrCreate(
                ['name' => $item['name']],
                $item
            );
        }

        // Configure contract meal rates for clients
        $client1->update(['lunch_rate' => 120.00, 'dinner_rate' => 140.00]);
        $client2->update(['lunch_rate' => 130.00, 'dinner_rate' => 150.00]);
        $client3->update(['lunch_rate' => 125.00, 'dinner_rate' => 145.00]);
        $client4->update(['lunch_rate' => 135.00, 'dinner_rate' => 155.00]);

        // Seed custom item override: Client 1 gets Mutton Kacchi Biryani for ৳200 instead of ৳220
        if (isset($createdItems['Special Mutton Kacchi Biryani'])) {
            ClientMenuPrice::updateOrCreate(
                [
                    'client_id' => $client1->id,
                    'menu_item_id' => $createdItems['Special Mutton Kacchi Biryani']->id,
                ],
                [
                    'custom_price' => 200.00,
                    'is_active' => true,
                ]
            );
        }

        // 6. Seed Daily Menus (Today, Yesterday, Tomorrow)
        $today = Carbon::today()->format('Y-m-d');
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');

        // Today's Standard Lunch Menu (Global)
        $todayLunch = DailyMenu::updateOrCreate(
            ['client_id' => null, 'date' => $today, 'meal_type' => 'Lunch'],
            [
                'title' => 'Standard Executive Lunch - ' . Carbon::today()->format('M d, Y'),
                'base_price' => 120.00,
                'notes' => 'Includes rice, choice of chicken/egg, seasonal labra, and thick lentil dal.',
                'is_published' => true,
            ]
        );

        $lunchItemNames = ['Steamed Basmati Rice', 'Shahi Chicken Roast', 'Mixed Seasonal Vegetables (Labra)', 'Thick Moong Lentil Dal'];
        $todayLunch->items()->delete();
        foreach ($lunchItemNames as $idx => $name) {
            if (isset($createdItems[$name])) {
                DailyMenuItem::create([
                    'daily_menu_id' => $todayLunch->id,
                    'menu_item_id' => $createdItems[$name]->id,
                    'serving_portion' => $name === 'Shahi Chicken Roast' ? '1 pc (quarter leg)' : 'Standard portion',
                    'sort_order' => $idx,
                ]);
            }
        }

        // Today's Standard Dinner Menu (Global)
        $todayDinner = DailyMenu::updateOrCreate(
            ['client_id' => null, 'date' => $today, 'meal_type' => 'Dinner'],
            [
                'title' => 'Executive Dinner - ' . Carbon::today()->format('M d, Y'),
                'base_price' => 140.00,
                'notes' => 'Includes steamed rice, tender beef bhuna, dal, and fresh vegetables.',
                'is_published' => true,
            ]
        );

        $dinnerItemNames = ['Steamed Basmati Rice', 'Traditional Beef Bhuna', 'Mixed Seasonal Vegetables (Labra)', 'Thick Moong Lentil Dal'];
        $todayDinner->items()->delete();
        foreach ($dinnerItemNames as $idx => $name) {
            if (isset($createdItems[$name])) {
                DailyMenuItem::create([
                    'daily_menu_id' => $todayDinner->id,
                    'menu_item_id' => $createdItems[$name]->id,
                    'serving_portion' => 'Standard portion',
                    'sort_order' => $idx,
                ]);
            }
        }

        // Tomorrow's Special Lunch Menu for XYZ Software Ltd.
        $tomorrowLunch = DailyMenu::updateOrCreate(
            ['client_id' => $client1->id, 'date' => $tomorrow, 'meal_type' => 'Lunch'],
            [
                'title' => 'Special Feast Lunch for XYZ Software Ltd.',
                'base_price' => 200.00,
                'notes' => 'Special company celebration menu: Kacchi Biryani, Borhani, and Firni.',
                'is_published' => true,
            ]
        );

        $specialItems = ['Special Mutton Kacchi Biryani', 'Traditional Borhani', 'Sweet Zafrani Firni'];
        $tomorrowLunch->items()->delete();
        foreach ($specialItems as $idx => $name) {
            if (isset($createdItems[$name])) {
                DailyMenuItem::create([
                    'daily_menu_id' => $tomorrowLunch->id,
                    'menu_item_id' => $createdItems[$name]->id,
                    'serving_portion' => '1 set',
                    'sort_order' => $idx,
                ]);
            }
        }

        // 7. Seed Meal Entries (Milestone 05)
        // Seed lunch for XYZ Software Ltd. employees for today
        $xyzEmployees = Employee::where('client_id', $client1->id)->get();
        $lunchCount1 = 0;
        foreach ($xyzEmployees as $emp) {
            if ($emp->lunch_enabled) {
                $lunchCount1++;
                MealEntry::updateOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'date' => $today,
                        'meal_type' => 'Lunch',
                    ],
                    [
                        'client_id' => $client1->id,
                        'status' => 'consumed',
                        'unit_price' => 120.00,
                        'total_price' => 120.00,
                    ]
                );
            }
        }

        DailyMealConfirmation::updateOrCreate(
            [
                'client_id' => $client1->id,
                'date' => $today,
                'meal_type' => 'Lunch',
            ],
            [
                'total_count' => $lunchCount1,
                'unit_price' => 120.00,
                'total_amount' => $lunchCount1 * 120.00,
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]
        );

        // Seed lunch & dinner for ABC Bank Ltd. for yesterday
        $bankEmployees = Employee::where('client_id', $client2->id)->get();
        $lunchCount2 = 0;
        $dinnerCount2 = 0;
        foreach ($bankEmployees as $emp) {
            if ($emp->lunch_enabled) {
                $lunchCount2++;
                MealEntry::updateOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'date' => $yesterday,
                        'meal_type' => 'Lunch',
                    ],
                    [
                        'client_id' => $client2->id,
                        'status' => 'consumed',
                        'unit_price' => 130.00,
                        'total_price' => 130.00,
                    ]
                );
            }

            if ($emp->dinner_enabled) {
                $dinnerCount2++;
                MealEntry::updateOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'date' => $yesterday,
                        'meal_type' => 'Dinner',
                    ],
                    [
                        'client_id' => $client2->id,
                        'status' => 'consumed',
                        'unit_price' => 150.00,
                        'total_price' => 150.00,
                    ]
                );
            }
        }

        DailyMealConfirmation::updateOrCreate(
            [
                'client_id' => $client2->id,
                'date' => $yesterday,
                'meal_type' => 'Lunch',
            ],
            [
                'total_count' => $lunchCount2,
                'unit_price' => 130.00,
                'total_amount' => $lunchCount2 * 130.00,
                'status' => 'confirmed',
                'confirmed_at' => Carbon::yesterday()->setHour(12),
            ]
        );

        DailyMealConfirmation::updateOrCreate(
            [
                'client_id' => $client2->id,
                'date' => $yesterday,
                'meal_type' => 'Dinner',
            ],
            [
                'total_count' => $dinnerCount2,
                'unit_price' => 150.00,
                'total_amount' => $dinnerCount2 * 150.00,
                'status' => 'confirmed',
                'confirmed_at' => Carbon::yesterday()->setHour(18),
            ]
        );
    }
}

