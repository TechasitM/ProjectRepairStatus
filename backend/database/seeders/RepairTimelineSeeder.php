<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RepairTimeline;
use Carbon\Carbon;

class RepairTimelineSeeder extends Seeder
{
    public function run(): void
    {
        RepairTimeline::create([
            'repair_order_id' => 1,
            'status_id' => 1,
            'user_id' => 1,
            'note' => 'รับเครื่องจากลูกค้า',
            'update_datetime' => Carbon::now()->subDays(2)
        ]);

        RepairTimeline::create([
            'repair_order_id' => 2,
            'status_id' => 2,
            'user_id' => 1,
            'note' => 'ตรวจสอบอาการแล้ว',
            'update_datetime' => Carbon::now()->subDay()
        ]);
    }
}
