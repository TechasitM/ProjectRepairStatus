<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        Notification::create([
            'repair_id' => 1,
            'channel' => 'web',
            'sent_datetime' => Carbon::now()->subDay(),
            'notification_status' => 'sent'
        ]);
    }
}
