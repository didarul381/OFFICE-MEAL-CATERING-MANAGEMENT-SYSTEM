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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->enum('category', [
                'Main Course',
                'Side Dish',
                'Protein',
                'Beverage',
                'Dessert',
                'Other',
            ])->default('Main Course')->index();
            $table->text('description')->nullable();
            $table->decimal('default_price', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true)->index();
            $table->string('image_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
