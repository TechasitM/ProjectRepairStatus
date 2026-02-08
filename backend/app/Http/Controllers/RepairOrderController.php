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
            'timelines.user',
            'repairOrders.status'
        ])->findOrFail($id);

        return response()->json([
            'data' => $repair
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'repair_code' => 'required|string|unique:repair_orders,repair_code',
            'customer_id' => 'required|exists:customers,id',
            'device_id'   => 'required|array|min:1',
            'device_id.*' => 'exists:devices,id',
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
            'user_id'     => $request->user_id,
            'status_id'   => $request->status_id,
            'problem_description' => $request->problem_description,
            'receive_date' => $request->receive_date,
            'estimate_price' => $request->estimate_price,
            'final_price' => null,
        ]);

        // 2️⃣ ผูกอุปกรณ์ (Many-to-Many)
        $repair->devices()->attach($request->device_id);

        return response()->json([
            'message' => 'สร้างใบสั่งซ่อมสำเร็จ',
            'data' => $repair->load('devices')
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $rules = [
            'status_id' => 'required|exists:repair_statuses,id',
            'note' => 'nullable|string',
        ];

        // ⭐ ถ้า Close Job ต้องมี Final Price
        if ($request->status_id == 5) {
            $rules['final_price'] = 'required|numeric|min:0';
        }

        $request->validate($rules);

        $repair = RepairOrder::with(['customer', 'devices', 'status'])
            ->findOrFail($id);

        // ⭐ Update Status + Final Price
        $updateData = [
            'status_id' => $request->status_id,
        ];

        if ($request->filled('final_price')) {
            $updateData['final_price'] = $request->final_price;
        }

        $repair->update($updateData);

        $updateTime = now();

        // Timeline
        $repair->timelines()->create([
            'status_id' => $request->status_id,
            'user_id' => auth()->id() ?: 1,
            'note' => $request->note ?? 'อัปเดตสถานะงานซ่อม',
            'update_datetime' => $updateTime,
        ]);

        $repair->load('status');
        $statusName = $repair->status->status_name;

        // Email + Notification
        if ($repair->customer->email) {
            try {
                Mail::to($repair->customer->email)->send(
                    new RepairStatusUpdated(
                        $repair,
                        $statusName,
                        $request->note,
                        $updateTime
                    )
                );

                Notification::create([
                    'repair_order_id' => $repair->id,
                    'channel' => 'email',
                    'sent_datetime' => $updateTime,
                    'notification_status' => 'sent',
                ]);
            } catch (\Exception $e) {

                Notification::create([
                    'repair_order_id' => $repair->id,
                    'channel' => 'email',
                    'sent_datetime' => $updateTime,
                    'notification_status' => 'failed',
                ]);

                \Log::error('MAIL ERROR', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $repair->load([
                'status',
                'timelines' => fn ($q) => $q->orderByDesc('update_datetime'),
                'timelines.status',
            ]),
        ]);
    }
}

