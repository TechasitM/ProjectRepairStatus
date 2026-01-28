<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Customer::create([
            'customer_name' => 'สมชาย ใจดี',
            'phone' => '0812345678',
            'email' => 'somchai@test.com'
        ]);

        Customer::create([
            'customer_name' => 'สมหญิง มีสุข',
            'phone' => '0899999999',
            'email' => 'somying@test.com'
        ]);
    }
}
