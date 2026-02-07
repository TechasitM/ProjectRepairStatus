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
        'spec_detail',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function repairOrders()
    {
        return $this->belongsToMany(
            RepairOrder::class,
            'repair_order_device',
            'device_id',
            'repair_order_id'
        );
    }
}

