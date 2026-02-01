<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicTrackingController extends Controller
{
        // ===== PUBLIC (ลูกค้า) =====
  public function show($keyword) //ค้นหาด้วย code 
    {
        $query = RepairOrder::with(['status', 'timelines.status', 'customer', 'notifications']);

        if (is_numeric($keyword)) {
            $query->where('id', $keyword);
        } else {
            $query->where('repair_code', $keyword);
        }

        return $query->firstOrFail();
    }

    public function trackByPhoneLatest($phone)//ค้นหาด้วย Phone
    {
        return response()->json(
            RepairOrder::whereHas('customer', function ($q) use ($phone) {
                    $q->where('phone', $phone);
                })
                // เพิ่ม 'timelines.status' เข้าไปตรงนี้
                ->with(['status', 'customer', 'timelines.status','notifications']) 
                ->latest('created_at')
                ->firstOrFail()
        );
    }
}
