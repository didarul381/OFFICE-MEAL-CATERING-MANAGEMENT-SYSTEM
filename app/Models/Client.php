<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
        'city',
        'delivery_address',
        'number_of_employees',
        'meal_types',
        'office_start_time',
        'lunch_cutoff_time',
        'dinner_cutoff_time',
        'special_instructions',
        'status',
        'notes',
    ];

    protected $casts = [
        'meal_types' => 'array',
        'number_of_employees' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship to client users (login accounts).
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relationship to employees enrolled under this client.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Sync and update the headcount based on enrolled employees.
     */
    public function syncEmployeeCount(): void
    {
        $this->update(['number_of_employees' => $this->employees()->count()]);
    }

    /**
     * Scope to filter active clients.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search by name, contact_person, phone, or email.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('contact_person', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%");
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
     * Scope to filter by city.
     */
    public function scopeFilterCity(Builder $query, ?string $city): Builder
    {
        if (empty($city) || $city === 'all') {
            return $query;
        }

        return $query->where('city', $city);
    }

    /**
     * Get effective delivery address (fallback to main address).
     */
    public function getEffectiveDeliveryAddressAttribute(): string
    {
        return $this->delivery_address ?: $this->address;
    }
}
