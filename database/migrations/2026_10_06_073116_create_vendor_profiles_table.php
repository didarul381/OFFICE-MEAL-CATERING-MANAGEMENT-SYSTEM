<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendor_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('organization_name')->nullable();
            $table->string('owner_name');
            $table->string('phone', 30);
            $table->string('email');
            $table->text('address');
            $table->string('city', 100);
            $table->string('logo')->nullable();
            $table->string('business_type')->default('Corporate Meal & Catering');
            $table->string('vat_tin', 50)->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_profiles');
    }
};
