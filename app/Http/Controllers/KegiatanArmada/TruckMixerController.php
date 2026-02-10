<?php

namespace App\Http\Controllers\KegiatanArmada;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\Timbangan\ConcreteBatchingPlant;
use App\Models\Timbangan\StoneCrusher;

class TruckMixerController extends Controller
{
    public function getInvoceTruckMixer(Request $request)
    {
        $data = KegiatanArmada::where('status', 1)
            ->whereHas('jarak', function ($query) { // Masuk ke relasi jarak
                $query->whereHasMorph(
                    'source', // Nama field morph di tabel jarak
                    [
                        ConcreteBatchingPlant::class,
                        AsphaltMixingPlant::class,
                        StoneCrusher::class
                    ],
                    function ($q) {
                        // Di sini $q sudah menjadi instance dari salah satu 3 class di atas
                        // Langsung panggil relasi 'material' yang ada di model tersebut
                        $q->whereHas('material.kategori', function ($catQuery) {
                            $catQuery->where('kategori', 'HOTMIX');
                        });
                    }
                );
            })
            ->with([
                'jarak.source' => function ($morphTo) {
                    $morphTo->morphWith([
                        ConcreteBatchingPlant::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                        AsphaltMixingPlant::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                        StoneCrusher::class => ['material', 'material.kategori', 'kendaraan', 'driver', 'suplier'],
                    ]);
                }
            ])
            ->get();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => $data->isEmpty() ? 'Data tidak ditemukan' : 'Data berhasil ditemukan',
            'data'      => $data
        ]);
    }
}
