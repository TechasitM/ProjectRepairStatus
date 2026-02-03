<?php

namespace App\Http\Controllers;

use App\Models\RepairOrderDevice;
use App\Models\RepairOrder;
use Illuminate\Http\Request;

class RepairOrderDeviceController extends Controller
{
    /**
     * ดึงรายการอุปกรณ์ทั้งหมดที่อยู่ในใบสั่งซ่อมเดียวกัน (ตารางกลาง)
     */
    public function getDevicesByOrder($orderId)
    {
        // ดึงข้อมูลจากตารางกลางพร้อมข้อมูลอุปกรณ์ (Eager Loading)
        $items = RepairOrderDevice::with('device')
            ->where('repair_order_id', $orderId)
            ->get();

        return response()->json($items);
    }

    /**
     * เพิ่มอุปกรณ์เข้าไปในใบสั่งซ่อม (เก็บลงตารางกลาง)
     */
    public function store(Request $request)
    {
        $request->validate([
            'repair_order_id' => 'required|exists:repair_orders,id',
            'device_id'       => 'required|exists:devices,id',
        ]);

        // ป้องกันการเพิ่มอุปกรณ์ซ้ำในใบสั่งซ่อมเดิม
        $exists = RepairOrderDevice::where('repair_order_id', $request->repair_order_id)
            ->where('device_id', $request->device_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'อุปกรณ์นี้มีอยู่ในใบสั่งซ่อมนี้แล้ว'], 422);
        }

        $newItem = RepairOrderDevice::create([
            'repair_order_id' => $request->repair_order_id,
            'device_id'       => $request->device_id,
        ]);

        return response()->json([
            'message' => 'เพิ่มอุปกรณ์เข้าใบสั่งซ่อมสำเร็จ',
            'data'    => $newItem->load('device')
        ], 201);
    }

    /**
     * เพิ่มอุปกรณ์แบบหลายชิ้นพร้อมกัน (Bulk Insert) 
     * เหมาะสำหรับหน้า Frontend ที่เลือกหลายเครื่องแล้วกดบันทึกทีเดียว
     */
    public function addMultipleDevices(Request $request, $orderId)
    {
        $request->validate([
            'device_ids' => 'required|array',
            'device_ids.*' => 'exists:devices,id'
        ]);

        $order = RepairOrder::findOrFail($orderId);

        // ใช้ syncWithoutDetaching เพื่อเพิ่มข้อมูลลงตารางกลางโดยไม่ลบข้อมูลเก่าที่มีอยู่
        $order->devices()->syncWithoutDetaching($request->device_ids);

        return response()->json(['message' => 'เพิ่มอุปกรณ์ทั้งหมดลงในใบสั่งซ่อมสำเร็จ']);
    }

    /**
     * ลบอุปกรณ์ออกจากใบสั่งซ่อม (ลบจากตารางกลางเท่านั้น ไม่ได้ลบตัวอุปกรณ์)
     */
    public function destroy($id)
    {
        $item = RepairOrderDevice::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'นำอุปกรณ์ออกจากรายการสั่งซ่อมเรียบร้อย']);
    }
}