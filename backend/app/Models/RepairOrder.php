<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairOrder extends Model
{
    protected $fillable = [
        'repair_code',
        'customer_id',
        'user_id',
        'status_id',
        'problem_description',
        'receive_date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function devices()
    {
        return $this->belongsToMany(
            Device::class,
            'repair_order_device',
            'repair_order_id',
            'device_id'
        );
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(RepairStatus::class, 'status_id');
    }

    public function timelines()
    {
        return $this->hasMany(RepairTimeline::class, 'repair_order_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'repair_order_id');
    }
}


