<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;

    public const CATEGORIES = [
        'Main Course',
        'Side Dish',
        'Protein',
        'Beverage',
        'Dessert',
        'Other',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'category',
        'description',
        'default_price',
        'is_active',
        'image_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'default_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Client custom price overrides for this menu item.
     */
    public function clientMenuPrices(): HasMany
    {
        return $this->hasMany(ClientMenuPrice::class);
    }

    /**
     * Daily menu items linking this item to daily menus.
     */
    public function dailyMenuItems(): HasMany
    {
        return $this->hasMany(DailyMenuItem::class);
    }

    /**
     * Scope to active menu items.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
