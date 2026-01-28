<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairStatus;
use Carbon\Carbon;
use DB;

class DashBoardController extends Controller
{
    public function index()
    {
        // การ์ดสรุป
        $totalRepairs = RepairOrder::count();
        $todayRepairs = RepairOrder::whereDate('receive_date', Carbon::today())->count();

        $completedStatusId = RepairStatus::where('status_name', 'ซ่อมเสร็จ')->value('id');

        $completedRepairs = RepairOrder::where('status_id', $completedStatusId)->count();
        $pendingRepairs = RepairOrder::where('status_id', '!=', $completedStatusId)->count();

        $totalCustomers = Customer::count();

        // กราฟ: งานซ่อมแยกตามสถานะ
        $repairsByStatus = RepairStatus::leftJoin('repair_orders', 'repair_statuses.id', '=', 'repair_orders.status_id')
            ->select(
                'repair_statuses.status_name',
                DB::raw('COUNT(repair_orders.id) as total')
            )
            ->groupBy('repair_statuses.status_name')
            ->get();

        // กราฟ: งานซ่อมรายวัน (7 วันล่าสุด)
        $repairsByDate = RepairOrder::select(
                DB::raw('DATE(receive_date) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->whereDate('receive_date', '>=', Carbon::now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date')
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
            ]
        ]);
    }
}
