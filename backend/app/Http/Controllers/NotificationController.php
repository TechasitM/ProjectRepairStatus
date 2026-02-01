<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // ดึง notification ทั้งหมด (admin / debug)
    public function index()
    {
      return Notification::with('repairOrder')
        ->orderBy('sent_datetime', 'desc')
        ->get();
    }

    // ดึง notification ตามงานซ่อม (frontend ลูกค้า)
    public function byRepair($repairId)
    {
        return Notification::where('repair_id', $repairId)
            ->orderBy('sent_datetime', 'desc')
            ->get();
    }

    // บันทึก notification (ถูกเรียกจาก updateStatus)
    public function store(Request $request)
    {
        return Notification::create($request->all());
    }
}
