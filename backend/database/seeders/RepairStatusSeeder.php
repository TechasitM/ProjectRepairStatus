<?php

namespace Database\Seeders;

use App\Models\RepairStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RepairStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            'รับเครื่อง',
            'กำลังซ่อม',
            'รออะไหล่',
            'กำลังดำเนินการ',
            'ซ่อมเสร็จแล้ว',
            'ยกเลิก'
        ];

        foreach ($statuses as $status) {
            RepairStatus::create([
                'status_name' => $status
            ]);
        }
    }
}