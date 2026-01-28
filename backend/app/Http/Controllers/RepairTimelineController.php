<?php

namespace App\Http\Controllers;

use App\Models\RepairTimeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepairTimelineController extends Controller
{
    public function store(Request $request) {
        return RepairTimeline::create([
            'repair_id' => $request->repair_id,
            'status_id' => $request->status_id,
            'user_id'   => auth()->id(),
            'note'      => $request->note,
            'update_datetime' => now()
        ]);
    }
    
    public function updateStatus(Request $request, $id)
    {
        $repair = RepairOrder::findOrFail($id);

        // update status
        $repair->update(['status_id' => $request->status_id]);

        // save timeline
        RepairTimeline::create([
            'repair_id' => $repair->id,
            'status_id' => $request->status_id,
            'user_id' => auth()->id(),
            'update_datetime' => now()
        ]);

        return response()->json(['message'=>'status updated']);
    }

}


