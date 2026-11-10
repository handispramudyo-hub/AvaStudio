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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('roblox_username');
            $table->string('whatsapp');
            $table->foreignId('avatar_id')->nullable()->constrained('avatars')->nullOnDelete();
            $table->string('requested_style')->nullable();
            $table->unsignedInteger('budget')->nullable();
            $table->text('request_notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'revision', 'completed', 'cancelled'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
