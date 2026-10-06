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
        Schema::create('meal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('date')->index();
            $table->enum('meal_type', ['Lunch', 'Dinner'])->index();
            $table->enum('status', ['consumed', 'cancelled'])->default('consumed')->index();
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->boolean('is_overridden')->default(false);
            $table->foreignId('overridden_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['employee_id', 'date', 'meal_type'], 'unique_emp_date_meal');
            $table->index(['client_id', 'date', 'meal_type'], 'idx_client_date_meal');
            $table->index(['client_id', 'date'], 'idx_client_date');
        });

        Schema::create('daily_meal_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->date('date')->index();
            $table->enum('meal_type', ['Lunch', 'Dinner'])->index();
            $table->unsignedInteger('total_count')->default(0);
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->enum('status', ['confirmed', 'locked'])->default('confirmed');
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('confirmed_at')->nullable();
            $table->boolean('is_cutoff_overridden')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['client_id', 'date', 'meal_type'], 'unique_confirmation_client_date_meal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_meal_confirmations');
        Schema::dropIfExists('meal_entries');
    }
};
