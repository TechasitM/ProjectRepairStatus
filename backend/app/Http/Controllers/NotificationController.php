<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::with([
            'repairOrder:id,repair_code'
        ])
        ->orderBy('sent_datetime', 'desc')
        ->get();
    }

    public function byRepair($repairId)
    {
        return Notification::with([
            'repairOrder:id,repair_code'
        ])
        ->where('repair_order_id', $repairId)
        ->orderBy('sent_datetime', 'desc')
        ->get();
    }
}