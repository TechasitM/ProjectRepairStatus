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
        Schema::create('repair_timelines', function (Blueprint $table) {
            $table->id();
            $table->text('note')->nullable();
            $table->dateTime('update_datetime');

            $table->foreignId('repair_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('status_id')->constrained('repair_statuses');
            $table->foreignId('user_id')->constrained();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_timelines');
    }
};
