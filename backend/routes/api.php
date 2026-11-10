<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvatarController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Website Settings
Route::get('/settings/public', [SettingController::class, 'publicSettings']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);

// Avatars Catalog
Route::get('/avatars', [AvatarController::class, 'index']);
Route::get('/avatars/{slug}', [AvatarController::class, 'show']);

// Testimonials
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Order Submission
Route::post('/orders', [OrderController::class, 'store']);

// Admin Auth
Route::post('/admin/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Sanctum Authenticated)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard Analytics
    Route::get('/dashboard', [DashboardController::class, 'stats']);

    // Avatars Management
    Route::get('/avatars', [AvatarController::class, 'index']);
    Route::post('/avatars', [AvatarController::class, 'store']);
    Route::get('/avatars/{id}', [AvatarController::class, 'show']);
    Route::post('/avatars/{id}', [AvatarController::class, 'update']);
    Route::put('/avatars/{id}', [AvatarController::class, 'update']);
    Route::delete('/avatars/{id}', [AvatarController::class, 'destroy']);
    Route::delete('/avatar-images/{id}', [AvatarController::class, 'deleteImage']);

    // Categories Management
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories/{id}', [CategoryController::class, 'update']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);

    // Testimonials Management
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
    Route::post('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);

    // Website Settings Management
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);
    Route::put('/settings', [SettingController::class, 'update']);
});
