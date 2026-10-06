<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateVendorProfileRequest;
use App\Models\VendorProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VendorProfileController extends Controller
{
    /**
     * Show the vendor profile view and edit form.
     */
    public function edit(): Response
    {
        $profile = VendorProfile::firstOrCreate(
            ['id' => 1],
            [
                'business_name' => 'ABC Catering & Food Services',
                'organization_name' => 'ABC Hospitality & Food Logistics Ltd.',
                'owner_name' => 'Rafiqul Islam',
                'phone' => '+880 1712-345678',
                'email' => 'info@abccatering.com',
                'address' => 'House 42, Road 11, Banani C/A',
                'city' => 'Dhaka',
                'business_type' => 'Corporate Meal & Catering Services',
                'vat_tin' => 'BIN-9876543210',
                'status' => 'active',
            ]
        );

        return Inertia::render('Vendor/Profile', [
            'vendorProfile' => $profile,
            'canEdit' => auth()->user()->isVendorAdmin(),
        ]);
    }

    /**
     * Update the vendor profile.
     */
    public function update(UpdateVendorProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $profile = VendorProfile::first();

        if ($request->hasFile('logo')) {
            if ($profile && $profile->logo && Storage::disk('public')->exists($profile->logo)) {
                Storage::disk('public')->delete($profile->logo);
            }

            $validated['logo'] = $request->file('logo')->store('vendor-logos', 'public');
        }

        if ($profile) {
            $profile->update($validated);
        } else {
            $profile = VendorProfile::create($validated);
        }

        return redirect()->route('vendor.profile')->with('success', 'Vendor profile updated successfully.');
    }
}
