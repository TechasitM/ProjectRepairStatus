<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TechDashBoardController extends Controller
{
    public function index()
    {
        // นับจำนวนแยกตามสถานะ (อ้างอิงตามเลขสถานะที่คุณให้มา)
        $statusCounts = RepairOrder::select('status_id', DB::raw('count(*) as total'))
            ->groupBy('status_id')
            ->get()
            ->keyBy('status_id');

        // 1. การ์ดสรุปสำหรับช่าง
        $cards = [
            'newJobs' => $statusCounts->get(1)->total ?? 0,       // #1 รับเครื่อง
            'inProgress' => $statusCounts->get(2)->total ?? 0,    // #2 กำลังซ่อม
            'waitingParts' => $statusCounts->get(3)->total ?? 0,  // #3 รออะไหล่
            'completedToday' => RepairOrder::where('status_id', 4) // #4 ซ่อมเสร็จ
                ->whereDate('updated_at', Carbon::today())
                ->count(),
        ];

        // 2. รายการงานที่ต้องทำเร่งด่วน (รับเครื่องแล้วแต่ยังไม่ได้ซ่อม หรือกำลังซ่อม)
        // เรียงตามวันที่รับเครื่องเก่าสุดขึ้นก่อน (FIFO)
        $priorityTasks = RepairOrder::with(['status', 'customer'])
            ->whereIn('status_id', [1, 2]) 
            ->orderBy('receive_date', 'ASC')
            ->limit(10)
            ->get();

        // 3. รายการรออะไหล่ (#3)
        $waitingPartsList = RepairOrder::where('status_id', 3)
            ->orderBy('updated_at', 'DESC')
            ->get();

        return response()->json([
            'cards' => $cards,
            'priorityTasks' => $priorityTasks,
            'waitingPartsList' => $waitingPartsList,
            'totalAll' => RepairOrder::count()
        ]);
    }
}