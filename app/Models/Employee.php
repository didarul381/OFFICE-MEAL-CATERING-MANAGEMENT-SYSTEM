<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    public const MEAL_PREFERENCES = [
        'Standard',
        'Vegetarian',
        'Non-Veg',
        'No Beef',
        'Halal',
    ];

    protected $fillable = [
        'client_id',
        'name',
        'employee_id',
        'phone',
        'email',
        'department',
        'designation',
        'meal_preference',
        'lunch_enabled',
        'dinner_enabled',
        'status',
        'joining_date',
        'notes',
    ];

    protected $casts = [
        'lunch_enabled' => 'boolean',
        'dinner_enabled' => 'boolean',
        'joining_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship to Client Organization.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Scope to filter by client ID.
     */
    public function scopeForClient(Builder $query, ?int $clientId): Builder
    {
        if (empty($clientId)) {
            return $query;
        }

        return $query->where('client_id', $clientId);
    }

    /**
     * Scope to search by employee name, ID, phone, or email.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('employee_id', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('department', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to filter by status.
     */
    public function scopeFilterStatus(Builder $query, ?string $status): Builder
    {
        if (empty($status) || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    /**
     * Scope to filter by department.
     */
    public function scopeFilterDepartment(Builder $query, ?string $department): Builder
    {
        if (empty($department) || $department === 'all') {
            return $query;
        }

        return $query->where('department', $department);
    }

    /**
     * Scope to filter by meal preference.
     */
    public function scopeFilterMealPreference(Builder $query, ?string $preference): Builder
    {
        if (empty($preference) || $preference === 'all') {
            return $query;
        }

        return $query->where('meal_preference', $preference);
    }

    /**
     * Scope to filter active employees.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }
}
