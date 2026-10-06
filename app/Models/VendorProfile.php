<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'business_name',
        'organization_name',
        'owner_name',
        'phone',
        'email',
        'address',
        'city',
        'logo',
        'business_type',
        'vat_tin',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the active vendor profile singleton instance.
     */
    public static function current(): ?self
    {
        return self::first();
    }
}
