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
    DashBoardController
};

/* ===== PUBLIC ===== */
Route::get('/repairs/{keyword}', [PublicTrackingController::class, 'show']);
Route::get('/repairs/phone/{phone}', [PublicTrackingController::class, 'trackByPhoneLatest']);
Route::get('/repairs/{repairId}/notifications',[NotificationController::class, 'byRepair']);

/* ===== AUTH ===== */
Route::post('/login', [AuthController::class, 'login']);

// --- กลุ่มที่เข้าได้ทั้ง Admin (1) และ Technician (2) ---
Route::middleware(['auth:sanctum', 'role:1,2'])->group(function () {
    
    // การบริหารจัดการระบบ
    Route::get('/dashboard', [DashBoardController::class, 'index']); 
    // ข้อมูลส่วนตัวและระบบ
    Route::get('/user-profile', fn(Request $request) => response()->json($request->user()));
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    // งานซ่อม (Technician ทำงานที่ได้รับมอบหมาย / Admin ควบคุมภาพรวม)
    Route::patch('/repairs/{id}/status', [RepairOrderController::class, 'updateStatus']);
    Route::apiResource('/repairs', RepairOrderController::class);

    // จัดการอุปกรณ์ในตารางกลาง (RepairOrderDevice)
    Route::prefix('repair-items')->group(function () {
        Route::get('/order/{orderId}', [RepairOrderDeviceController::class, 'getDevicesByOrder']);
        Route::post('/', [RepairOrderDeviceController::class, 'store']);
        Route::post('/bulk/{orderId}', [RepairOrderDeviceController::class, 'addMultipleDevices']);
        Route::delete('/{id}', [RepairOrderDeviceController::class, 'destroy']);
    });

    // อุปกรณ์และตัวเลือกดรอปดาวน์
    Route::apiResource('/devices', DeviceController::class);
    Route::get('/dropdown-customer-device/{customer_id}', [DeviceController::class, 'dropdownCustomerDevice']);

    // รายชื่อลูกค้า (อนุญาตให้ช่างดูและเพิ่มลูกค้าหน้างานได้)
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    Route::post('/customers', [CustomerController::class, 'store']);
    
    // รายการสถานะ (ช่างต้องอ่านข้อมูลไปใส่ Dropdown ได้)
    Route::get('/statuses', [RepairStatusController::class, 'index']);
});
// --- กลุ่มที่ Admin (1) เข้าได้คนเดียวเท่านั้น ---    
Route::middleware(['auth:sanctum', 'role:1'])->group(function () {
    
    //จัดการ user crud
    Route::prefix('tecmanagement')->group(function () {
        Route::get('/', [TecController::class, 'index']);       // list
        Route::post('/', [TecController::class, 'store']);      // create
        Route::get('/{id}', [TecController::class, 'show']);    // edit (get one)
        Route::put('/{id}', [TecController::class, 'update']);  // update
        Route::delete('/{id}', [TecController::class, 'destroy']); // delete
    });
    // Route::post('/register', [AuthController::class, 'register']);

    // สิทธิ์ที่ Admin มีมากกว่า (เช่น การลบ หรือ แก้ไขข้อมูลสำคัญ)
    Route::apiResource('/customers', CustomerController::class)->only(['update', 'destroy']);
    Route::apiResource('/statuses', RepairStatusController::class)->except(['index']);
    
    // ตัวอย่างเพิ่มเติม: Admin เท่านั้นที่ลบใบซ่อมได้
    Route::delete('/repairs/{id}', [RepairOrderController::class, 'destroy']);
});