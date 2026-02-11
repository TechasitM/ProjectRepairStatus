<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairTimeline extends Model
{
    protected $table = 'repair_timelines';
    
    protected $fillable = [
        'repair_order_id',
        'status_id',
        'user_id',
        'note',
        'update_datetime'
    ];

    public function repairOrder()
    {
        return $this->belongsTo(RepairOrder::class);
    }

    public function status()
    {
        return $this->belongsTo(RepairStatus::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

