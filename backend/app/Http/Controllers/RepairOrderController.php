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
            'timelines.user',
            'repairOrders.status'
        ])->findOrFail($id);

        return response()->json([
            'data' => $repair
        ]);
    }

  public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:repair_statuses,id', // ✅ แก้ตรงนี้
            'note' => 'nullable|string',
        ]);

        $repair = RepairOrder::with(['customer', 'devices', 'status'])
            ->findOrFail($id);

        // 1. Update main status
        $repair->update([
            'status_id' => $request->status_id,
        ]);

        $updateTime = now();

        // 2. Create timeline
        $repair->timelines()->create([
            'status_id' => $request->status_id,
            'user_id' => auth()->id() ?: 1,
            'note' => $request->note ?? 'อัปเดตสถานะงานซ่อม',
            'update_datetime' => $updateTime,
        ]);

        $repair->load('status');
        $statusName = $repair->status->status_name;

        // 3. Send email + notification
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

