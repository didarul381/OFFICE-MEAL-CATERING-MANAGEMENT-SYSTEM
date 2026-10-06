<?php

namespace App\Services;

use App\Models\Client;
use App\Models\DailyMenu;
use App\Models\MenuItem;

class PricingService
{
    /**
     * System default baseline rates if neither client nor menu provides an override.
     */
    public const DEFAULT_LUNCH_RATE = 120.00;
    public const DEFAULT_DINNER_RATE = 140.00;

    /**
     * Calculate effective per-meal price for a client on a given date and meal type.
     */
    public static function getMealPrice(Client $client, string $mealType, ?string $date = null): float
    {
        $normalizedMealType = ucfirst(strtolower($mealType));

        // 1. Check if client has a custom daily menu with a designated base price
        if ($date) {
            $clientDailyMenu = DailyMenu::where('client_id', $client->id)
                ->where('date', $date)
                ->where('meal_type', $normalizedMealType)
                ->where('is_published', true)
                ->first();

            if ($clientDailyMenu && $clientDailyMenu->base_price !== null && $clientDailyMenu->base_price > 0) {
                return (float) $clientDailyMenu->base_price;
            }
        }

        // 2. Check client's contract rate for the meal type
        if ($normalizedMealType === 'Lunch' && $client->lunch_rate !== null && $client->lunch_rate > 0) {
            return (float) $client->lunch_rate;
        }

        if ($normalizedMealType === 'Dinner' && $client->dinner_rate !== null && $client->dinner_rate > 0) {
            return (float) $client->dinner_rate;
        }

        // 3. Check if there is a global daily menu with a base price for this date
        if ($date) {
            $globalDailyMenu = DailyMenu::whereNull('client_id')
                ->where('date', $date)
                ->where('meal_type', $normalizedMealType)
                ->where('is_published', true)
                ->first();

            if ($globalDailyMenu && $globalDailyMenu->base_price !== null && $globalDailyMenu->base_price > 0) {
                return (float) $globalDailyMenu->base_price;
            }
        }

        // 4. Default fallback
        return $normalizedMealType === 'Lunch'
            ? self::DEFAULT_LUNCH_RATE
            : self::DEFAULT_DINNER_RATE;
    }

    /**
     * Get client-specific price for an individual menu item (or master default price).
     */
    public static function getItemPrice(Client $client, MenuItem $menuItem): float
    {
        $override = $client->clientMenuPrices()
            ->where('menu_item_id', $menuItem->id)
            ->where('is_active', true)
            ->first();

        if ($override && $override->custom_price !== null && $override->custom_price > 0) {
            return (float) $override->custom_price;
        }

        return (float) ($menuItem->default_price ?? 0.00);
    }

    /**
     * Compute total cost for a batch of meals.
     */
    public static function calculateTotalCost(Client $client, string $mealType, int $count, ?string $date = null): float
    {
        $unitPrice = self::getMealPrice($client, $mealType, $date);
        return round($unitPrice * max(0, $count), 2);
    }
}
