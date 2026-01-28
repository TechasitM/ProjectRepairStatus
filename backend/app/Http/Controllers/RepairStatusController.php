<?php

namespace App\Http\Controllers;

use App\Models\RepairStatus;
use Illuminate\Http\Request;

class RepairStatusController extends Controller
{
    public function index() {
        return RepairStatus::all();
    }

    public function store(Request $request) {
        return RepairStatus::create($request->all());
    }

    public function update(Request $request, $id) {
        $status = RepairStatus::findOrFail($id);
        $status->update($request->all());
        return $status;
    }

    public function destroy($id) {
        RepairStatus::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
}

