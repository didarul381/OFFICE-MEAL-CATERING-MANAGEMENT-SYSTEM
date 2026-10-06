<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use App\Models\VendorProfile;
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
    }
}
