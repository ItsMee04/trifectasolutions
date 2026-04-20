<?php

namespace App\Http\Controllers\Penjualan;

use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\Timbangan\ConcreteBatchingPlant;
use App\Models\Timbangan\StoneCrusher;
use Illuminate\Http\Request;

class PenjualanController extends Controller
{
    public function getPenjualan()
    {
        $data = KegiatanArmada::where('status', 1) // Menambahkan filter di tabel utama
            ->with([
                'jarak.source' => function ($morphTo) {
                    $morphTo->morphWith([
                        StoneCrusher::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                        ConcreteBatchingPlant::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                        AsphaltMixingPlant::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                    ]);
                }
            ])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kegiatan armada tidak ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data kegiatan armada berhasil ditemukan',
            'data' => $data
        ], 200);
    }
}
