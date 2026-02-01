<?php

namespace App\Http\Controllers;

use App\Mail\RepairStatusUpdated;
use App\Models\RepairOrder;
use App\Models\RepairOrderDevice;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class RepairOrderController extends Controller
{

    // ===== ADMIN =====
    public function index()
    {
        return RepairOrder::with(['customer','devices','status'])->get();
    }
    
    public function show($id)
    {
        $repair = RepairOrder::with([
            'customer',
            'devices',
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
            'user_id'             => 'required|exists:users,id',
            'status_id'           => 'required|exists:repair_statuses,id',
            'problem_description' => 'nullable|string',
            'receive_date'        => 'required|date',
        ]);
        $deviceIds = $request['device_id'];
        // 2. บันทึกข้อมูล 
        $repairOrder = RepairOrder::create($validated);
        if($repairOrder){
            foreach ($deviceIds as $deviceId) {
                RepairOrderDevice::create([
                    'repair_order_id' => $repairOrder->id,
                    'device_id' => $deviceId,
                ]);
            }
        }
        // 3. ตอบกลับเป็น JSON พร้อมข้อมูลที่เพิ่งสร้าง
        return response()->json([
            'message' => 'สร้างใบสั่งซ่อมเรียบร้อยแล้ว',
            'data'    => $request
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

        $repair = RepairOrder::with(['customer', 'devices', 'status'])
            ->findOrFail($id);

        // 1. อัปเดตสถานะหลัก
        $repair->update([
            'status_id' => $request->status_id
        ]);

        // 2. บันทึก Timeline
        $repair->timelines()->create([
            'status_id' => $request->status_id,
            'user_id' => auth()->id() ?? 1,
            'note' => $request->note ?? 'อัปเดตสถานะงานซ่อม',
            'update_datetime' => now()
        ]);

        $repair->refresh();
        $statusName = $repair->status->status_name;

        // 3. ส่ง Email + บันทึก Notification
        if ($repair->customer->email) {
            try {
                Mail::to($repair->customer->email)->send(
                    new RepairStatusUpdated($repair, $statusName, $request->note)
                );

                // ✅ บันทึกเฉพาะเมื่อส่งสำเร็จ
                Notification::create([
                    'repair_order_id' => $repair->id,
                    'channel' => 'email',
                    'sent_datetime' => now(),
                    'notification_status' => 'sent'
                ]);

                \Log::info('EMAIL SENT', [
                    'email' => $repair->customer->email,
                    'repair_id' => $repair->id
                ]);

            } catch (\Exception $e) {

                // ❌ Mail fail → log failed
                Notification::create([
                    'repair_order_id' => $repair->id,
                    'channel' => 'email',
                    'sent_datetime' => now(),
                    'notification_status' => 'failed'
                ]);

                \Log::error('MAIL ERROR', [
                    'error' => $e->getMessage()
                ]);
            }
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $repair->load(['status', 'timelines.status'])
        ]);
    }
}

