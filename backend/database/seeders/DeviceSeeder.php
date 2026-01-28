<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Device;

class DeviceSeeder extends Seeder
{
    public function run(): void
    {
        Device::create([
            'customer_id' => 1,
            'device_type' => 'Notebook',
            'brand' => 'ASUS',
            'model' => 'Vivobook',
            'serial_number' => 'ASUS123456'
        ]);

        Device::create([
            'customer_id' => 2,
            'device_type' => 'PC',
            'brand' => 'Intel',
            'model' => 'Core i5',
            'serial_number' => 'PC987654'
        ]);
    }
}
