<?php

use Illuminate\Http\Request;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\{
    AuthController,
    CustomerController,
    DeviceController,
    RepairOrderController,
    PublicTrackingController,
    RepairStatusController,
    RepairTimelineController,
    DashBoardController
};

/* ===== PUBLIC ===== */
Route::get('/repairs/{keyword}', [PublicTrackingController::class, 'show']);
Route::get('/repairs/phone/{phone}', [PublicTrackingController::class, 'trackByPhoneLatest']);

/* ===== AUTH ===== */
Route::post('/login', [AuthController::class, 'login']);


/* ===== ADMIN ===== */
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user-profile', function (Request $request) {
        return response()->json($request->user());
    });
    

    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::get('/dashboard', [DashBoardController::class, 'index']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::apiResource('/repairs', RepairOrderController::class);
        Route::apiResource('/customers', CustomerController::class);
        Route::apiResource('/devices', DeviceController::class);
        Route::apiResource('/statuses', RepairStatusController::class);
        Route::patch('/repairs/{id}/status', [RepairOrderController::class, 'updateStatus']);
    });
});