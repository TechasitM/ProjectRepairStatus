<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TecController extends Controller
{
   // 1. รายชื่อช่างทั้งหมด (role = 1,2)
    public function index()
    {
        return User::whereIn('role', ['1','2'])
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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 2,
        ]);

        return response()->json([
            'status' => 200,
            'user' => $user,
            'message' => 'เพิ่มช่างเทคนิคสำเร็จ'
        ]);
    }

    // 3. ดึงข้อมูลคนเดียว
    public function show($id)
    {
        return User::findOrFail($id);
    }

    // 4. อัปเดตข้อมูลทั่วไป
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|min:8',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'อัปเดตข้อมูลสำเร็จ',
            'data' => $user
        ]);
    }

    // 5. เปลี่ยน Role (Admin เท่านั้น)
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:1,2'
        ]);

        $user = User::findOrFail($id);

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'เปลี่ยนสิทธิ์เรียบร้อย',
            'data' => $user
        ]);
    }

    // 6. ลบ
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'ลบผู้ใช้เรียบร้อย'
        ]);
    }
}