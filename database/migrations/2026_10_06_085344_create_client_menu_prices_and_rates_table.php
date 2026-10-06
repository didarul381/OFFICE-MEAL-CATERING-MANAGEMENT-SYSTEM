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
        // Add default meal rates to clients table
        Schema::table('clients', function (Blueprint $table) {
            $table->decimal('lunch_rate', 10, 2)->default(120.00)->after('dinner_cutoff_time');
            $table->decimal('dinner_rate', 10, 2)->default(140.00)->after('lunch_rate');
        });

        // Create client specific menu item price overrides
        Schema::create('client_menu_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->decimal('custom_price', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['client_id', 'menu_item_id'], 'unique_client_menu_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_menu_prices');

        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['lunch_rate', 'dinner_rate']);
        });
    }
};
