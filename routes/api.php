<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Master\DriverController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\SuplierController;
use App\Http\Controllers\Master\KategoriController;
use App\Http\Controllers\Master\MaterialController;
use App\Http\Controllers\Master\KendaraanController;
use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\KegiatanArmada\JarakDanHargaController;
use App\Http\Controllers\Timbangan\AsphaltMixingPlantController;
use App\Http\Controllers\Timbangan\ConcreteBatchingPlantController;
use App\Http\Controllers\Timbangan\StoneCrusherController;

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

    //API PEGAWAI
    Route::get('pegawai/getPegawai', [PegawaiController::class, 'getPegawai']);
    Route::post('pegawai/storePegawai', [PegawaiController::class, 'storePegawai']);
    Route::post('pegawai/updatePegawai', [PegawaiController::class, 'updatePegawai']);
    Route::post('pegawai/deletePegawai', [PegawaiController::class, 'deletePegawai']);

    //API USERS
    Route::get('users/getUsers', [UserController::class, 'getUsers']);
    Route::post('users/updateUsers', [UserController::class, 'updateUsers']);

    // API DRIVERS
    Route::get('driver/getDriver', [DriverController::class, 'getDriver']);
    Route::post('driver/storeDriver', [DriverController::class, 'storeDriver']);
    Route::post('driver/updateDriver', [DriverController::class, 'updateDriver']);
    Route::post('driver/deleteDriver', [DriverController::class, 'deleteDriver']);

    // API SUPLIER
    Route::get('suplier/getSuplier', [SuplierController::class, 'getSuplier']);
    Route::post('suplier/storeSuplier', [SuplierController::class, 'storeSuplier']);
    Route::post('suplier/updateSuplier', [SuplierController::class, 'updateSuplier']);
    Route::post('suplier/deleteSuplier', [SuplierController::class, 'deleteSuplier']);

    // API KENDARAAN
    Route::get('kendaraan/getKendaraan', [KendaraanController::class, 'getKendaraan']);
    Route::post('kendaraan/storeKendaraan', [KendaraanController::class, 'storeKendaraan']);
    Route::post('kendaraan/updateKendaraan', [KendaraanController::class, 'updateKendaraan']);
    Route::post('kendaraan/deleteKendaraan', [KendaraanController::class, 'deleteKendaraan']);

    // API KATEGORI
    Route::get('kategori/getKategori', [KategoriController::class, 'getKategori']);
    Route::post('kategori/storeKategori', [KategoriController::class, 'storeKategori']);
    Route::post('kategori/updateKategori', [KategoriController::class, 'updateKategori']);
    Route::post('kategori/deleteKategori', [KategoriController::class, 'deleteKategori']);

    //API MATERIAL
    Route::get('material/getMaterial', [MaterialController::class, 'getMaterial']);
    Route::post('material/storeMaterial', [MaterialController::class, 'storeMaterial']);
    Route::post('material/updateMaterial', [MaterialController::class, 'updateMaterial']);
    Route::post('material/deleteMaterial', [MaterialController::class, 'deleteMaterial']);

    //API STONECRUSHER
    Route::post('stonecrusher/getStoneCrusher', [StoneCrusherController::class, 'getStoneCrusher']);
    Route::post('stonecrusher/storeStoneCrusher', [StoneCrusherController::class, 'storeStoneCrusher']);
    Route::post('stonecrusher/updateStoneCrusher', [StoneCrusherController::class, 'updateStoneCrusher']);
    Route::post('stonecrusher/deleteStoneCrusher', [StoneCrusherController::class, 'deleteStoneCrusher']);

    //API CONCRETE BATCHING PLANT
    Route::post('concretebatchingplant/getConcreteBatchingPlant', [ConcreteBatchingPlantController::class, 'getConcreteBatchingPlant']);
    Route::post('concretebatchingplant/storeConcreteBatchingPlant', [ConcreteBatchingPlantController::class, 'storeConcreteBatchingPlant']);
    Route::post('concretebatchingplant/updateConcreteBatchingPlant', [ConcreteBatchingPlantController::class, 'updateConcreteBatchingPlant']);
    Route::post('concretebatchingplant/deleteConcreteBatchingPlant', [ConcreteBatchingPlantController::class, 'deleteConcreteBatchingPlant']);

    //API CONCRETE BATCHING PLANT
    Route::post('asphaltmixingplant/getAsphaltMixingPlant', [AsphaltMixingPlantController::class, 'getAsphaltMixingPlant']);
    Route::post('asphaltmixingplant/storeAsphaltMixingPlant', [AsphaltMixingPlantController::class, 'storeAsphaltMixingPlant']);
    Route::post('asphaltmixingplant/updateAsphaltMixingPlant', [AsphaltMixingPlantController::class, 'updateAsphaltMixingPlant']);
    Route::post('asphaltmixingplant/deleteAsphaltMixingPlant', [AsphaltMixingPlantController::class, 'deleteAsphaltMixingPlant']);

    //API JARAK & HARGA
    Route::get('jarakdanharga/getJarakDanHarga', [JarakDanHargaController::class, 'getJarakDanHarga']);
    Route::post('jarakdanharga/storeJarakDanHarga', [JarakDanHargaController::class, 'storeJarakDanHarga']);
    Route::post('jarakdanharga/updateJarakDanHarga', [JarakDanHargaController::class, 'updateJarakDanHarga']);
    Route::post('jarakdanharga/deleteJarakDanHarga', [JarakDanHargaController::class, 'deleteJarakDanHarga']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
