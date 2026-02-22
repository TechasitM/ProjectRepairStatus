<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicTrackingController extends Controller
{
        // ===== PUBLIC (ลูกค้า) =====
    public function show($keyword)
    {
        $query = RepairOrder::select([
                'id',
                'repair_code',
                'receive_date',
                'problem_description',
                'estimate_price',
                'final_price',
                'closed_at',
                'status_id',
                'customer_id'
            ])
            ->with([
                'status:id,status_name',
                'customer:id,customer_name',
                'timelines:id,repair_order_id,status_id,note,update_datetime',
                'timelines.status:id,status_name',
                'notifications:id,repair_order_id,channel,notification_status,sent_datetime'
            ]);

        if (is_numeric($keyword)) {
            $query->where('id', $keyword);
        } else {
            $query->where('repair_code', $keyword);
        }

        return response()->json($query->firstOrFail());
    }

    public function trackByPhoneLatest($phone)
    {
        return response()->json(
            RepairOrder::select([
                    'id',
                    'repair_code',
                    'receive_date',
                    'problem_description',
                    'estimate_price',
                    'final_price',
                    'closed_at',
                    'status_id',
                    'customer_id'
                ])
                ->whereHas('customer', function ($q) use ($phone) {
                    $q->where('phone', $phone);
                })
                ->with([
                    'status:id,status_name',
                    'customer:id,customer_name',
                    'timelines:id,repair_order_id,status_id,note,update_datetime',
                    'timelines.status:id,status_name',
                    'notifications:id,repair_order_id,channel,notification_status,sent_datetime'
                ])
                ->latest('created_at')
                ->firstOrFail()
        );
    }
}
