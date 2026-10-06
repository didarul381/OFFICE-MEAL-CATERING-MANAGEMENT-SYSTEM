<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VendorProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page redirect to login or dashboard
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Authenticated application routes
Route::middleware(['auth'])->group(function () {
    // Dashboard Shell
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Vendor Profile Management (Vendor Admin full edit, Vendor Staff view)
    Route::get('/vendor/profile', [VendorProfileController::class, 'edit'])
        ->middleware('role:vendor_admin,vendor_staff')
        ->name('vendor.profile');

    Route::post('/vendor/profile', [VendorProfileController::class, 'update'])
        ->middleware('role:vendor_admin')
        ->name('vendor.profile.update');

    // User Profile settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
