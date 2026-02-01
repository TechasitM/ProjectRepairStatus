<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    // เพิ่ม ...$roles เข้าไปในพารามิเตอร์ตัวสุดท้าย
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // ตรวจสอบว่า User ล็อกอิน และมีค่า role ตรงกับที่ส่งมาจาก Route หรือไม่
        if ($request->user() && in_array($request->user()->role, $roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden: You do not have the right role.'], 403);
    }
}