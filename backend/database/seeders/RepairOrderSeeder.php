<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RepairOrder;
use Carbon\Carbon;

class RepairOrderSeeder extends Seeder
{
    public function run(): void
    {
        RepairOrder::create([
            'repair_code' => 'REP001',
            'customer_id' => 1,
            'user_id' => 1,
            'status_id' => 1,
            'estimate_price' => 500,
            'problem_description' => 'เปิดไม่ติด',
            'receive_date' => Carbon::now()->subDays(2),
        ]);

        RepairOrder::create([
            'repair_code' => 'REP002',
            'customer_id' => 2,
            'user_id' => 1,
            'status_id' => 1,
            'estimate_price' => 500,
            'problem_description' => 'จอฟ้า',
            'receive_date' => Carbon::now()->subDay(),
        ]);
    }
}
