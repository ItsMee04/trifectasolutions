<?php

namespace App\Http\Controllers\KegiatanArmada;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\ConcreteBatchingPlant;

class JarakDanHargaController extends Controller
{
    public function getJarakDanHarga()
    {
        $data = JarakHarga::with([
            'source' => function ($morphTo) {
                $morphTo->morphWith([
                    \App\Models\Timbangan\StoneCrusher::class => ['material', 'material.kategori', 'kendaraan', 'kendaraan.jeniskendaraan', 'driver', 'suplier'],
                    \App\Models\Timbangan\ConcreteBatchingPlant::class => ['material', 'material.kategori', 'kendaraan', 'kendaraan.jeniskendaraan', 'driver', 'suplier'],
                    \App\Models\Timbangan\AsphaltMixingPlant::class => ['material', 'material.kategori', 'kendaraan', 'kendaraan.jeniskendaraan', 'driver', 'suplier'],
                ]);
            },
            'kegiatanArmada',
        ])
        ->where('status', 1)
        /* Menyaring agar hanya mengambil JarakHarga yang sourcenya
           berasal dari AsphaltMixingPlant
        */
        ->whereHasMorph('source', [\App\Models\Timbangan\AsphaltMixingPlant::class], function ($query) {
            // Jika ingin filter source_id tertentu, tambahkan di sini:
            // $query->where('id', 1);
        })
        ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Jarak dan Harga tidak ditemukan.',
                'data'      => [],
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Jarak dan Harga berhasil diambil.',
            'data'      => $data,
        ], 200);
    }

    public function updateJarakDanHarga(Request $request)
    {
        // 1. Eager Load relasi sampai ke tabel BahanBakar
        $jarakdanharga = JarakHarga::with(['source.kendaraan.jeniskendaraan'])->find($request->id);

        if (!$jarakdanharga) {
            return response()->json(['status' => 404, 'success' => false, 'message' => 'Data tidak ditemukan']);
        }

        $request->validate([
            'upahdriver'        => 'required|integer',
            'upahpermaterial'   => 'required|integer',
        ]);

        // 4. Update data
        $inserjarak = $jarakdanharga->update([
            'hargaupah'         => $request->upahdriver,
            'hargajasa'         => $request->upahpermaterial,
        ]);

        if ($inserjarak) {
            KegiatanArmada::where('jarak_id', $request->id)
                ->update([
                    'hargasolar'            => $request->hargasolar,
                    'nominalbiayasolar'     => $request->solarjarak
                ]);
        }

        return response()->json([
            'status'  => 200,
            'success' => true,
            'message' => 'Data berhasil dihitung dan diupdate.',
            'data'    => $jarakdanharga
        ]);
    }

    public function deleteJarakDanHarga(Request $request)
    {
        $jarak = JarakHarga::find($request->id);

        if (!$jarak) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jarak & harga tidak ditemukan.',
            ]);
        }

        $deleteJarak = $jarak->update(['status' => 0]);

        if ($deleteJarak) {
            KegiatanArmada::where('jarak_id', $jarak->id)->update([
                'status'    => 0,
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jarak & harga berhasil di hapus.',
        ], 200);
    }
}
