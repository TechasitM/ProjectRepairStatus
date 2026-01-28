<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'customer_id',
        'device_type',
        'brand',
        'model',
        'serial_number',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function repairOrders()
    {
        return $this->hasMany(RepairOrder::class);
    }
}

