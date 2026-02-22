<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashBoardController extends Controller
{
    public function index()
    {
       $user = Auth::user();

        // เช็ค role = 2 (technician)
        if ($user->role != 2) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userId = $user->id;
        $now = Carbon::now();

        // -----------------------------
        // 🎯 เป้ารายเดือน (ไม่เพิ่ม field)
        // -----------------------------
        $target = env('TEC_MONTHLY_TARGET', 15000);

        // -----------------------------
        // 💰 รายได้เดือนปัจจุบัน (ปิดงานแล้ว)
        // -----------------------------
        $monthlyRevenue = RepairOrder::where('user_id', $userId)
            ->where('status_id', 5) // 5 = Close Job
            ->whereMonth('closed_at', $now->month)
            ->whereYear('closed_at', $now->year)
            ->sum('final_price');

        // -----------------------------
        // 📦 จำนวนงานทั้งหมดเดือนนี้
        // -----------------------------
        $monthlyJobs = RepairOrder::where('user_id', $userId)
            ->whereMonth('receive_date', $now->month)
            ->whereYear('receive_date', $now->year)
            ->count();

        // -----------------------------
        // 🔄 งานที่ยังไม่ปิด
        // -----------------------------
        $pendingJobs = RepairOrder::where('user_id', $userId)
            ->where('status_id', '!=', 5)
            ->count();

        // -----------------------------
        // 📊 เปอร์เซ็นบรรลุเป้า
        // -----------------------------
        $percent = $target > 0
            ? round(($monthlyRevenue / $target) * 100, 2)
            : 0;

        // -----------------------------
        // 📈 กราฟย้อนหลัง 6 เดือน
        // -----------------------------
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $chartData = RepairOrder::selectRaw('
                DATE_FORMAT(closed_at, "%Y-%m") as month,
                SUM(final_price) as total
            ')
            ->where('user_id', $userId)
            ->where('status_id', 5)
            ->where('closed_at', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'summary' => [
                'monthly_revenue' => $monthlyRevenue,
                'target' => $target,
                'percent' => $percent,
                'monthly_jobs' => $monthlyJobs,
                'pending_jobs' => $pendingJobs,
            ],
            'chart' => $chartData
        ]);
    }
}