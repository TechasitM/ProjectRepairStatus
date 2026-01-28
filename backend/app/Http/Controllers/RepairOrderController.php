<?php

namespace App\Http\Controllers;

use App\Mail\RepairStatusUpdated;
use App\Models\RepairOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepairOrderController extends Controller
{

    // ===== ADMIN =====
    public function index()
    {
        return RepairOrder::with(['customer','device','status'])->get();
    }
    
    public function show($id)
    {
        $repair = RepairOrder::with([
            'customer',
            'device',
            'status',
            'timelines.status',
            'timelines.user'
        ])->findOrFail($id);

        return response()->json([
            'data' => $repair
        ]);
    }

    public function store(Request $request)
    {
        // 1. กำหนดกฎการตรวจสอบ
        $validated = $request->validate([
            'repair_code'         => 'required|string|unique:repair_orders,repair_code',
            'customer_id'         => 'required|exists:customers,id',
            'device_id'           => 'required|exists:devices,id',
            'user_id'             => 'required|exists:users,id',
            'status_id'           => 'required|exists:repair_statuses,id',
            'problem_description' => 'nullable|string',
            'receive_date'        => 'required|date',
        ]);

        // 2. บันทึกข้อมูล 
        $repairOrder = RepairOrder::create($validated);

        // 3. ตอบกลับเป็น JSON พร้อมข้อมูลที่เพิ่งสร้าง
        return response()->json([
            'message' => 'สร้างใบสั่งซ่อมเรียบร้อยแล้ว',
            'data'    => $repairOrder
         ], 201); 
    }

    public function update(Request $request, $id)
    {
        $repair = RepairOrder::findOrFail($id);
        $repair->update($request->all());
        return $repair;
    }

    public function destroy($id)
    {
        RepairOrder::destroy($id);
        return response()->json(['message' => 'deleted']);
    }

   public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:repair_statuses,id',
            'note' => 'nullable|string'
        ]);

        $repair = RepairOrder::with(['customer', 'device', 'status'])->findOrFail($id);

        // อัปเดตตารางหลัก
        $repair->update(['status_id' => $request->status_id]);

        // บันทึก Timeline
        $repair->timelines()->create([
            'status_id' => $request->status_id,
            'user_id' => auth()->id() ?? 1, // ปรับตามระบบ Auth ของคุณ
            'note' => $request->note ?? 'อัปเดตสถานะงานซ่อม',
            'update_datetime' => now()
        ]);

        $repair->refresh();
        $statusName = $repair->status->status_name;

        // ส่งอีเมลผ่าน Mailtrap
        if ($repair->customer->email) {
            try {
                Mail::to($repair->customer->email)->send(
                    new RepairStatusUpdated($repair, $statusName, $request->note)
                );
            } catch (\Exception $e) {
                \Log::error("Mail Error: " . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Updated and Email Sent!',
            'data' => $repair->load(['status', 'timelines.status'])
        ]);
    }
}
