<?php

namespace Database\Seeders;

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

        // 2. Create foundational role accounts
        $users = [
            [
                'name' => 'Rafiqul Islam (Vendor Admin)',
                'email' => 'admin@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_VENDOR_ADMIN,
                'phone' => '+880 1712-345678',
                'status' => 'active',
            ],
            [
                'name' => 'Kabir Hossain (Vendor Staff)',
                'email' => 'staff@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_VENDOR_STAFF,
                'phone' => '+880 1812-345679',
                'status' => 'active',
            ],
            [
                'name' => 'Tanvir Ahmed (Client Admin)',
                'email' => 'client@office.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_CLIENT_ADMIN,
                'phone' => '+880 1912-345680',
                'status' => 'active',
            ],
            [
                'name' => 'Rahim Mia (Delivery Rider)',
                'email' => 'rider@catering.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_RIDER,
                'phone' => '+880 1612-345681',
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
