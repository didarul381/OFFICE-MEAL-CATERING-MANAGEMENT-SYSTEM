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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('vendor_admin')->after('email')->index();
            $table->string('phone', 20)->nullable()->after('role')->index();
            $table->string('status', 20)->default('active')->after('phone')->index();
            $table->unsignedBigInteger('client_id')->nullable()->after('status')->index();
            $table->string('avatar')->nullable()->after('client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['phone']);
            $table->dropIndex(['status']);
            $table->dropIndex(['client_id']);
            $table->dropColumn(['role', 'phone', 'status', 'client_id', 'avatar']);
        });
    }
};
