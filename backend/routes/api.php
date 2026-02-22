<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\{
    AuthController,
    CustomerController,
    DeviceController,
    RepairOrderController,
    PublicTrackingController,
    RepairStatusController,
    NotificationController,
    RepairTimelineController,
    TecController,
    DashBoardController,
    DashBoardAdminController,
};

/* ===== PUBLIC ===== */
Route::get('/repairs/{keyword}', [PublicTrackingController::class, 'show']);
Route::get('/repairs/phone/{phone}', [PublicTrackingController::class, 'trackByPhoneLatest']);

/* ===== AUTH ===== */
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
// --- กลุ่มที่เข้าได้ทั้ง Admin (1) และ Technician (2) ---
    Route::middleware(['role:1,2'])->group(function () {
        
        // การบริหารจัดการระบบ
        Route::get('/dashboard', [DashBoardController::class, 'index']);
        
        // ข้อมูลส่วนตัวและระบบ
        Route::get('/user-profile', fn(Request $request) => response()->json($request->user()));
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/notifications', [NotificationController::class, 'index']);

        // งานซ่อม (Technician ทำงานที่ได้รับมอบหมาย / Admin ควบคุมภาพรวม)
        Route::patch('/repairs/{id}/status', [RepairOrderController::class, 'updateStatus']);
        Route::apiResource('/repairs', RepairOrderController::class);

        // อุปกรณ์และตัวเลือกดรอปดาวน์
        Route::apiResource('/devices', DeviceController::class);
        Route::get('/dropdown-customer-device/{customer_id}', [DeviceController::class, 'dropdownCustomerDevice']);

        // รายชื่อลูกค้า (อนุญาตให้ช่างดูและเพิ่มลูกค้าหน้างานได้)
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);
        Route::post('/customers', [CustomerController::class, 'store']);
        
        //เป็นการดู log Timeline
        Route::get('/repairs/{repair}/timeline',[RepairTimelineController::class, 'byRepair']);

        // รายการสถานะ
        Route::apiResource('/statuses', RepairStatusController::class);
    });
    
// --- กลุ่มที่ Admin (1) เข้าได้คนเดียวเท่านั้น ---    
    Route::middleware(['role:1'])->group(function () {
        
        //จัดการ user crud
        Route::prefix('tecmanagement')->group(function () {
            Route::get('/', [TecController::class, 'index']);       // list
            Route::post('/', [TecController::class, 'store']);      // create
            Route::get('/{id}', [TecController::class, 'show']);    // edit (get one)
            Route::put('/{id}', [TecController::class, 'update']);  // update
            Route::delete('/{id}', [TecController::class, 'destroy']); // delete
            Route::patch('/{id}/role', [TecController::class, 'updateRole']);// update role only
        });

        // การบริหารจัดการระบบ
        Route::get('/admin/dashboard-stats', [DashboardAdminController::class, 'index']);
        
        // สิทธิ์ที่ Admin มีมากกว่า (เช่น การลบ หรือ แก้ไขข้อมูลสำคัญ)
        Route::apiResource('/customers', CustomerController::class)->only(['update', 'destroy']);
    });
});