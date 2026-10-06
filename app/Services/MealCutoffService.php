<?php

namespace App\Services;

use App\Models\Client;
use App\Models\User;
use Carbon\Carbon;

class MealCutoffService
{
    public const DEFAULT_LUNCH_CUTOFF = '10:00';
    public const DEFAULT_DINNER_CUTOFF = '16:00';

    /**
     * Determine if the ordering/modification cutoff has passed for a client and date/meal type.
     */
    public static function isCutoffPassed(Client $client, string $mealType, string $date): bool
    {
        $today = Carbon::today()->format('Y-m-d');

        // Past dates are always past cutoff
        if ($date < $today) {
            return true;
        }

        // Future dates have not passed cutoff
        if ($date > $today) {
            return false;
        }

        // Today: evaluate against time of day
        $now = Carbon::now();
        $normalizedType = ucfirst(strtolower($mealType));

        if ($normalizedType === 'Lunch') {
            $cutoffStr = $client->lunch_cutoff_time ?: self::DEFAULT_LUNCH_CUTOFF;
            $cutoff = Carbon::createFromTimeString($cutoffStr);
            return $now->greaterThan($cutoff);
        }

        if ($normalizedType === 'Dinner') {
            $cutoffStr = $client->dinner_cutoff_time ?: self::DEFAULT_DINNER_CUTOFF;
            $cutoff = Carbon::createFromTimeString($cutoffStr);
            return $now->greaterThan($cutoff);
        }

        return false;
    }

    /**
     * Get human-readable configured cutoff time for a client.
     */
    public static function getCutoffTime(Client $client, string $mealType): string
    {
        $normalizedType = ucfirst(strtolower($mealType));
        $rawTime = $normalizedType === 'Lunch'
            ? ($client->lunch_cutoff_time ?: self::DEFAULT_LUNCH_CUTOFF)
            : ($client->dinner_cutoff_time ?: self::DEFAULT_DINNER_CUTOFF);

        try {
            return Carbon::createFromTimeString($rawTime)->format('g:i A');
        } catch (\Throwable) {
            return $rawTime;
        }
    }

    /**
     * Verify whether a user is permitted to record or adjust meal entries.
     *
     * @return array{allowed: bool, is_cutoff: bool, is_override: bool, reason: string|null}
     */
    public static function checkPermissions(User $user, Client $client, string $mealType, string $date): array
    {
        $isCutoff = self::isCutoffPassed($client, $mealType, $date);

        if (! $isCutoff) {
            return [
                'allowed' => true,
                'is_cutoff' => false,
                'is_override' => false,
                'reason' => null,
            ];
        }

        // Cutoff passed: Check if user is Vendor Admin with override authority
        if ($user->isVendorAdmin()) {
            return [
                'allowed' => true,
                'is_cutoff' => true,
                'is_override' => true,
                'reason' => 'Cutoff time has passed. Authorized Vendor Admin override is enabled.',
            ];
        }

        $cutoffFormatted = self::getCutoffTime($client, $mealType);

        return [
            'allowed' => false,
            'is_cutoff' => true,
            'is_override' => false,
            'reason' => "The cutoff time ({$cutoffFormatted}) for {$mealType} has passed for {$date}. Changes are locked. Please contact catering management for assistance.",
        ];
    }
}
