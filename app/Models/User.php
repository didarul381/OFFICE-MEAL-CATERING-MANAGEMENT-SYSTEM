<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_VENDOR_ADMIN = 'vendor_admin';
    public const ROLE_VENDOR_STAFF = 'vendor_staff';
    public const ROLE_CLIENT_ADMIN = 'client_admin';
    public const ROLE_RIDER = 'rider';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'status',
        'client_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isVendorAdmin(): bool
    {
        return $this->role === self::ROLE_VENDOR_ADMIN;
    }

    public function isVendorStaff(): bool
    {
        return $this->role === self::ROLE_VENDOR_STAFF;
    }

    public function isClientAdmin(): bool
    {
        return $this->role === self::ROLE_CLIENT_ADMIN;
    }

    public function isRider(): bool
    {
        return $this->role === self::ROLE_RIDER;
    }

    public function hasVendorAccess(): bool
    {
        return in_array($this->role, [self::ROLE_VENDOR_ADMIN, self::ROLE_VENDOR_STAFF], true);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
