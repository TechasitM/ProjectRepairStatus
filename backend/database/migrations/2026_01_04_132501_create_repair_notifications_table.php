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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')
                ->constrained('repair_orders')
                ->cascadeOnDelete();
            $table->string('channel'); // web, email
            $table->dateTime('sent_datetime')->nullable();
            $table->string('notification_status'); // sent, pending, failed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_notifications');
    }
};
