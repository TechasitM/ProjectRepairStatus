<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // ใช้ Facade ให้ถูกต้อง

class DashBoardController extends Controller
{
    public function index()
    {
        // 1. การ์ดสรุปข้อมูล (ใช้ Count โดยตรงเพื่อความเร็ว)
        $totalRepairs = RepairOrder::count();
        $todayRepairs = RepairOrder::whereDate('receive_date', Carbon::today())->count();
        $totalCustomers = Customer::count();

        // ค้นหา ID ของสถานะที่ "สำเร็จแล้ว" (ป้องกันกรณีสะกดผิดหรือมีหลายชื่อ)
        $completedStatusIds = RepairStatus::whereIn('status_name', ['ซ่อมเสร็จ', 'ซ่อมเสร็จแล้ว', 'ส่งมอบแล้ว'])
            ->pluck('id');

        $completedRepairs = RepairOrder::whereIn('status_id', $completedStatusIds)->count();
        $pendingRepairs = RepairOrder::whereNotIn('status_id', $completedStatusIds)->count();

        // 2. กราฟ: งานซ่อมแยกตามสถานะ
        $repairsByStatus = RepairStatus::withCount('repairOrders as total') // สมมติว่าตั้งชื่อ Relationship ใน Model ว่า repairOrders
            ->get(['status_name']);

        // 3. กราฟ: งานซ่อมรายวัน (7 วันล่าสุด) - ปรับปรุงให้ครอบคลุมวันที่ไม่มีงานซ่อม (จะดียิ่งขึ้น)
        $repairsByDate = RepairOrder::select(
                DB::raw('DATE(receive_date) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->whereDate('receive_date', '>=', Carbon::now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // 4. ข้อมูลเพิ่มเติม: งานรอดำเนินการล่าสุด 5 รายการ (สำหรับตารางใน Dashboard)
        $recentPending = RepairOrder::with('status')
            ->whereNotIn('status_id', $completedStatusIds)
            ->orderBy('created_at', 'DESC')
            ->limit(5)
            ->get(['id', 'repair_code', 'symptom', 'description', 'status_id']);

        // 5. อาการเสียยอดฮิต (Top 5) - ส่งไปจาก Backend เลยจะคำนวณเร็วกว่า
        $topSymptoms = RepairOrder::select('symptom', DB::raw('count(*) as total'))
            ->whereNotNull('symptom')
            ->groupBy('symptom')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'cards' => [
                'totalRepairs' => $totalRepairs,
                'todayRepairs' => $todayRepairs,
                'completedRepairs' => $completedRepairs,
                'pendingRepairs' => $pendingRepairs,
                'totalCustomers' => $totalCustomers,
            ],
            'charts' => [
                'repairsByStatus' => $repairsByStatus,
                'repairsByDate' => $repairsByDate,
            ],
            'topSymptoms' => $topSymptoms,
            'recentPending' => $recentPending
        ]);
    }
}