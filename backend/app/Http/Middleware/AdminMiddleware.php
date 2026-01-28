<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // ตรวจสอบ user และเช็ค role โดยแปลงเป็น int
        if ($request->user() && (int)$request->user()->role === 1) {
            return $next($request);
        }

        // ถ้าไม่ใช่ 1 จะส่ง 403 กลับไป
        return response()->json(['message' => 'Unauthorized: Admin Only'], 403);
    }
}
