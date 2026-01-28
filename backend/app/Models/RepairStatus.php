<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairStatus extends Model
{
    protected $fillable = [
        'status_name',
    ];

    public function repairOrders()
    {
        return $this->hasMany(RepairOrder::class, 'status_id');
    }

    public function timelines()
    {
        return $this->hasMany(RepairTimeline::class, 'status_id');
    }
}

