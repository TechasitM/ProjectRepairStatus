<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    public function repairOrders()
    {
        return $this->hasMany(RepairOrder::class);
    }

    public function Timeline()
    {
        return $this->hasMany(RepairTimeline::class);
    }
    
    const ROLE_USER = 0;
    const ROLE_ADMIN = 1;

    // ฟังก์ชันช่วยเช็คว่าเป็น Admin หรือไม่
    public function isAdmin() {
        return $this->role === self::ROLE_ADMIN;
    }

}
