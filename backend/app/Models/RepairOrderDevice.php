<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RepairOrder;
use App\Models\Device;

class RepairOrderDevice extends Model
{   
    protected $table = 'repair_order_device';
    protected $fillable = [
        'repair_order_id',
        'device_id',
    ];

    public function repairOrder()
    {
        return $this->belongsTo(RepairOrder::class, 'repair_order_id');
    }
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}
