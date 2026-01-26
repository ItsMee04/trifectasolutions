<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Authentication\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['guest'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum'])->group(function(){
    //API ROLE
    Route::get('role/getRole', [RoleController::class, 'getRole']);
    Route::post('role/storeRole', [RoleController::class, 'storeRole']);
    Route::post('role/updateRole', [RoleController::class, 'updateRole']);
    Route::post('role/deleteRole', [RoleController::class, 'deleteRole']);
});

// Route::get('role/getRole', [RoleController::class, 'getRole']);
// Route::post('role/storeRole', [RoleController::class, 'storeRole']);
// Route::get('role/getRoleByID/{id}', [RoleController::class, 'getRoleByID']);
// Route::put('role/updateRole/{id}', [RoleController::class, 'updateRole']);
// Route::post('role/deleteRole', [RoleController::class, 'deleteRole']);
