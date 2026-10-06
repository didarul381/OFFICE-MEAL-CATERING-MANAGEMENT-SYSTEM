<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeImportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VendorProfileController;
use Illuminate\Support\Facades\Route;

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

    // Milestone 02: Client Organization Management
    Route::resource('clients', ClientController::class);
    Route::post('/clients/{client}/toggle-status', [ClientController::class, 'toggleStatus'])
        ->name('clients.toggle-status');
    Route::post('/clients/{client}/users', [ClientUserController::class, 'store'])
        ->name('clients.users.store');
    Route::post('/clients/{client}/users/{user}/toggle-status', [ClientUserController::class, 'toggleStatus'])
        ->name('clients.users.toggle-status');

    // Milestone 03: Employee Management & Bulk CSV Import
    Route::get('/employees/sample-csv', [EmployeeImportController::class, 'sampleCsv'])
        ->name('employees.sample-csv');
    Route::post('/employees/import', [EmployeeImportController::class, 'import'])
        ->name('employees.import');
    Route::resource('employees', EmployeeController::class);
    Route::post('/employees/{employee}/toggle-status', [EmployeeController::class, 'toggleStatus'])
        ->name('employees.toggle-status');

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
