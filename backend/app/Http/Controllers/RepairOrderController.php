<?php

namespace App\Http\Controllers;

use App\Mail\RepairStatusUpdated;
use App\Models\RepairOrder;
use App\Models\RepairStatus;
use App\Models\Device;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class RepairOrderController extends Controller
{
    
    public function index()
    {
        return RepairOrder::where('user_id', auth()->id())
            ->with(['customer','device','status','user'])
            ->get();
    }

  public function show($id)
    {
        $repair = RepairOrder::where('user_id', auth()->id())
            ->with([
                'customer',
                'device',
                'status',
                'timelines.status',
                'timelines.user',
            ])
            ->findOrFail($id);

        return response()->json([
            'data' => $repair
        ]);
    }
        
    public function store(Request $request)
    {
        $request->validate([
            'repair_code' => 'required|string|unique:repair_orders,repair_code',
            'customer_id' => 'required|exists:customers,id',
            'device_id' => 'required|exists:devices,id',
            'estimate_price' => 'nullable|numeric|min:0',
            'user_id'     => 'required|exists:users,id',
            'status_id'   => 'required|exists:repair_statuses,id',
            'problem_description' => 'nullable|string',
            'receive_date' => 'required|date',
        ]);

        // 1️⃣ สร้างใบสั่งซ่อม
        $repair = RepairOrder::create([
            'repair_code' => $request->repair_code,
            'customer_id' => $request->customer_id,
            'device_id' => $request->device_id,
            'user_id'     => $request->user_id,
            'status_id'   => $request->status_id,
            'problem_description' => $request->problem_description,
            'receive_date' => $request->receive_date,
            'estimate_price' => $request->estimate_price,
            'final_price' => null,
        ]);

        return response()->json([
            'message' => 'สร้างใบสั่งซ่อมสำเร็จ',
            'data' => $repair->load('device')
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        // 1️⃣ ดึงสถานะก่อน
        $status = RepairStatus::findOrFail($request->status_id);

        $rules = [
            'status_id' => 'required|exists:repair_statuses,id',
            'note' => 'nullable|string',
        ];

        // ถ้าเป็นสถานะ "เสร็จแล้ว" ต้องมีราคาสรุป
        if ($status->status_name === 'ซ่อมเสร็จแล้ว') {
            $rules['final_price'] = 'required|numeric|min:0';
        }

        $request->validate($rules);

        // 2️⃣ โหลดใบซ่อม
        $repair = RepairOrder::with(['customer', 'status'])
            ->findOrFail($id);

        $updateData = [
            'status_id' => $request->status_id,
        ];

        // 3️⃣ จัดการ closed_at
        if ($status->status_name === 'ซ่อมเสร็จแล้ว') {

            $updateData['final_price'] = $request->final_price;

            // บันทึกเวลาเฉพาะตอนยังไม่เคยปิด
            if (!$repair->closed_at) {
                $updateData['closed_at'] = now();
            }

        } else {
            //ถ้าเปลี่ยนออกจากสถานะเสร็จแล้ว
            $updateData['closed_at'] = null;
        }

        $repair->update($updateData);

        $updateTime = now();
        $updatedBy = auth()->user();

        // 4️⃣ บันทึก Timeline
        $repair->timelines()->create([
            'status_id' => $request->status_id,
            'user_id' => auth()->id(),
            'note' => $request->note ?? 'อัปเดตสถานะงานซ่อม',
            'update_datetime' => $updateTime,
        ]);

        // 5️⃣ ส่ง Email
        if ($repair->customer?->email) {
            Mail::to($repair->customer->email)->send(
                new RepairStatusUpdated(
                    $repair->fresh(['customer']),
                    $status->status_name,
                    $request->note,
                    $updateTime,
                    $updatedBy
                )
            );
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $repair->fresh([
                'status',
                'customer',
                'timelines'
            ]),
        ]);
    }
}

