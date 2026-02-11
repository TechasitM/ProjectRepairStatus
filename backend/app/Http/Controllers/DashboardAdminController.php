<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardAdminController extends Controller
{
  public function index()
    {
        // 1. สรุปสถานะงาน (Job Status Summary)
        $jobStatus = RepairStatus::withCount('repairOrders')
            ->get(['id', 'status_name']);

        // 2. ตัวชี้วัดรายได้ (Revenue Metrics) - อิงจาก final_price
        $revenue = [
            'daily' => RepairOrder::whereDate('updated_at', Carbon::today())->sum('final_price'),
            'weekly' => RepairOrder::whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->sum('final_price'),
            'monthly' => RepairOrder::whereMonth('updated_at', Carbon::now()->month)->sum('final_price'),
        ];

        // 3. ระยะเวลาซ่อมเฉลี่ย (Average Repair Time) 
        // คำนวณจาก receive_date ถึง update_datetime ของสถานะที่ id = 4 (ซ่อมเสร็จแล้ว)
        $avgRepairTime = DB::table('repair_orders as ro')
            ->join('repair_timelines as rt', 'ro.id', '=', 'rt.repair_order_id')
            ->where('rt.status_id', 4) 
            ->select(DB::raw('AVG(DATEDIFF(rt.update_datetime, ro.receive_date)) as avg_days'))
            ->first();

        // 4. สถิติอาการเสีย (Common Issues) - อิงจาก problem_description
        $commonIssues = RepairOrder::select('problem_description', DB::raw('count(*) as total'))
            ->groupBy('problem_description')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // 5. ความพึงพอใจลูกค้า (สมมติว่าเก็บในตาราง REPAIR_ORDER หรือเพิ่มฟิลด์ rating)
        // หากใน Diagram ยังไม่มี rating ผมจะดึงรายการซ่อมล่าสุดมาโชว์แทนเพื่อเป็น Activity Log
        $recentrepairs = RepairOrder::with(['customer', 'status'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'jobStatus' => $jobStatus,
            'revenue' => $revenue,
            'performance' => [
                'avgDays' => round($avgRepairTime->avg_days ?? 0, 1),
            ],
            'commonIssues' => $commonIssues,
            'recentRepairs' => $recentrepairs
        ]);
    }
}
