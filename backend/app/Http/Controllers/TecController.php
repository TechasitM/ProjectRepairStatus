<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TecController extends Controller
{
    // 1. รายชื่อช่างทั้งหมด
    public function index()
    {
        return User::where('role', '2')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // 2. สร้างช่างใหม่
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'อีเมลนี้ถูกใช้ไปแล้ว',
            'password.confirmed' => 'ยืนยันรหัสผ่านไม่ตรงกัน',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => '2', // กำหนด role เป็น 2 เสมอ
        ]);

        return response()->json([
            'status' => 200,
            'user' => $user,
            'message' => 'เพิ่มช่างเทคนิคสำเร็จ'
        ]);
    }

    // 3. ดึงข้อมูลช่างคนเดียว (สำหรับหน้าแก้ไข)
    public function show($id)
    {
        // แก้จาก 'tec' เป็น '2' เพื่อให้หาเจอ
        return User::where('role', '2')->findOrFail($id);
    }

    // 4. อัปเดตข้อมูลช่าง
    public function update(Request $request, $id)
    {
        $tec = User::where('role', '2')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($tec->id), // ข้ามการเช็ค unique สำหรับ email ตัวเอง
            ],
            'password' => 'nullable|min:8', // password เป็นค่าว่างได้ถ้าไม่ต้องการเปลี่ยน
        ]);

        $tec->name = $request->name;
        $tec->email = $request->email;

        if ($request->filled('password')) {
            $tec->password = Hash::make($request->password);
        }

        $tec->save();

        return response()->json([
            'status' => 200,
            'message' => 'อัปเดตข้อมูลสำเร็จ',
            'data' => $tec
        ]);
    }

    // 5. ลบช่าง
    public function destroy($id)
    {
        $tec = User::where('role', '2')->findOrFail($id);
        $tec->delete();

        return response()->json([
            'message' => 'ลบช่างเทคนิคเรียบร้อย'
        ]);
    }
}