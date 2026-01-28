<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'customer_name',
        'phone',
        'email',
    ];

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    public function repairOrders()
    {
        return $this->hasMany(RepairOrder::class);
    }
}
