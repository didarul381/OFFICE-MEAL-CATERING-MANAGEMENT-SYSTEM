<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MealEntry extends Model
{
    use HasFactory, SoftDeletes;

    public const MEAL_TYPES = ['Lunch', 'Dinner'];
    public const STATUS_CONSUMED = 'consumed';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'employee_id',
        'date',
        'meal_type',
        'status',
        'unit_price',
        'total_price',
        'is_overridden',
        'overridden_by',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date:Y-m-d',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'is_overridden' => 'boolean',
    ];

    /**
     * The client this meal was ordered for.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The employee who consumed the meal.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * The vendor user who authorized a cutoff override if applicable.
     */
    public function overriddenBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'overridden_by');
    }

    /**
     * Scope to filter by client.
     */
    public function scopeForClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    /**
     * Scope to filter by date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope to filter by meal type.
     */
    public function scopeMealType($query, string $mealType)
    {
        return $query->where('meal_type', $mealType);
    }

    /**
     * Scope to consumed/active meals.
     */
    public function scopeConsumed($query)
    {
        return $query->where('status', self::STATUS_CONSUMED);
    }
}
