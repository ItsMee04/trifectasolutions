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
    public function getJarakDanHarga(Request $request)
    {
        // 1. Mengambil 'type' dari body payload POST (misal: 'amp')
        $type = $request->input('type');

        // 2. Mapping String dari Payload ke Class Model Laravel
        // Gunakan strtolower untuk menghindari error jika payload dikirim huruf besar
        $modelClass = match (strtolower($type)) {
            'amp' => \App\Models\Timbangan\AsphaltMixingPlant::class,
            'cbp' => \App\Models\Timbangan\ConcreteBatchingPlant::class,
            'sc'  => \App\Models\Timbangan\StoneCrusher::class,
            default => null,
        };

        // 3. Jika payload 'type' tidak sesuai dengan mapping di atas
        if (!$modelClass) {
            return response()->json([
                'status'  => 400,
                'success' => false,
                'message' => "Payload type '{$type}' tidak valid atau tidak ditemukan.",
                'data'    => []
            ], 400);
        }

        // 4. Jalankan Query berdasarkan Model yang dipilih dari payload
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
            // Filter inilah yang menggunakan modelClass hasil payload tadi
            ->whereHasMorph('source', [$modelClass])
            ->orderBy('kode', 'asc')
            ->get();

        // 5. Response Berhasil
        return response()->json([
            'status'  => 200,
            'success' => true,
            'message' => "Data Jarak Harga " . strtoupper($type) . " berhasil diambil.",
            'data'    => $data,
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
