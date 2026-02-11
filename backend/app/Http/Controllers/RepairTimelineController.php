<?php

namespace App\Http\Controllers;

use App\Models\RepairTimeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepairTimelineController extends Controller
{
    public function byRepair($repairId)
        {
            return RepairTimeline::where('repair_order_id', $repairId)
                ->with(['user','status'])
                ->orderBy('update_datetime','desc')
                ->get();
        }
}   


