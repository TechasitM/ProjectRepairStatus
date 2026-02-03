<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index() {
        return Device::with('customer')->get();
    }

    public function store(Request $request) {
        return Device::create($request->all());
    }

    public function show($id) {
        return Device::with(['repairOrders.status', 'customer'])->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $device = Device::findOrFail($id);
        $device->update($request->all());
        return $device;
    }

    public function destroy($id) {
        Device::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
    
    public function dropdownCustomerDevice($customer_id) {
        $devices=Device::where("customer_id",$customer_id)->get();
            return response()->json([
            'data' => $devices ]);
    }
}

