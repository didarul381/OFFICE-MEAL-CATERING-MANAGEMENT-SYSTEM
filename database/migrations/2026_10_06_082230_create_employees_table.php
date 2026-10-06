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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('employee_id')->index();
            $table->string('phone', 30)->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('department', 100)->nullable()->index();
            $table->string('designation', 100)->nullable();
            $table->string('meal_preference', 50)->default('Standard')->index();
            $table->boolean('lunch_enabled')->default(true)->index();
            $table->boolean('dinner_enabled')->default(false)->index();
            $table->string('status', 20)->default('active')->index();
            $table->date('joining_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['client_id', 'employee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
