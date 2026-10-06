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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('contact_person');
            $table->string('phone', 30)->index();
            $table->string('email')->index();
            $table->text('address');
            $table->string('city', 100)->index();
            $table->text('delivery_address')->nullable();
            $table->unsignedInteger('number_of_employees')->default(0);
            $table->json('meal_types')->nullable();
            $table->string('office_start_time', 10)->nullable();
            $table->string('lunch_cutoff_time', 10)->nullable();
            $table->string('dinner_cutoff_time', 10)->nullable();
            $table->text('special_instructions')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add foreign key constraint to users table if client_id exists
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
        });

        Schema::dropIfExists('clients');
    }
};
