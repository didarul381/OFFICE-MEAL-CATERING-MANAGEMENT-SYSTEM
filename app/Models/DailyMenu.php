<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyMenu extends Model
{
    use HasFactory, SoftDeletes;

    public const MEAL_TYPES = ['Lunch', 'Dinner'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'date',
        'meal_type',
        'title',
        'base_price',
        'notes',
        'is_published',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date:Y-m-d',
        'base_price' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    /**
     * Client organization if this menu is customized for a specific client.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Items included in this daily menu.
     */
    public function items(): HasMany
    {
        return $this->hasMany(DailyMenuItem::class)->orderBy('sort_order');
    }

    /**
     * Scope query to a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope query to meal type.
     */
    public function scopeMealType($query, string $mealType)
    {
        return $query->where('meal_type', $mealType);
    }

    /**
     * Scope to published menus.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
