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
                    \App\Models\Timbangan\StoneCrusher::class => ['material', 'kendaraan', 'driver', 'suplier'],
                    \App\Models\Timbangan\ConcreteBatchingPlant::class => ['material', 'kendaraan', 'driver', 'suplier'],
                    \App\Models\Timbangan\AsphaltMixingPlant::class => ['material', 'kendaraan', 'driver', 'suplier'],
                ]);
            },
            'kegiatanArmada' // <--- Tambahkan relasi ini di sini
        ])
            ->where('status', 1)
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

    // public function updateJarakDanHarga(Request $request)
    // {
    //     $jarakdanharga = JarakHarga::find($request->id);

    //     if (!$jarakdanharga) {
    //         return response()->json([
    //             'status' => 404,
    //             'success' => false,
    //             'message' => 'Data jarak & harga tidak ditemukan.',
    //         ]);
    //     }

    //     // Kita gunakan optional() atau null safe operator agar tidak error jika relasi kosong
    //     $indexPerKm = $jarakdanharga->source->kendaraan->bahanbakar->indexperkm ?? 0;



    //     $request->validate([
    //         'jarak'         => 'required',
    //         'hargaupah'     => 'required|integer',
    //         'hargajasa'     => 'required|integer',
    //     ]);

    //     $jarakdanharga->update([
    //         'jarak'         => $request->jarak,
    //         'hargaupah'     => $request->hargaupah,
    //         'hargajasa'     => $request->hargajasa,
    //     ]);

    //     return response()->json([
    //         'status' => 200,
    //         'success' => true,
    //         'message' => 'Data jarak & harga berhasil diubah.',
    //         'data' => $jarakdanharga
    //     ], 200);
    // }

    public function updateJarakDanHarga(Request $request)
    {
        // 1. Eager Load relasi sampai ke tabel BahanBakar
        $jarakdanharga = JarakHarga::with(['source.kendaraan.jeniskendaraan'])->find($request->id);

        if (!$jarakdanharga) {
            return response()->json(['status' => 404, 'success' => false, 'message' => 'Data tidak ditemukan']);
        }

        $request->validate([
            'jarak'     => 'required|numeric',
            'hargaupah' => 'required|integer',
            'hargajasa' => 'required|integer',
            'hargasolar'=> 'required|integer', // Harga BBM per liter (misal 13000)
        ]);

        // 2. Ambil data indexperkm dari relasi (Gunakan 1 sebagai default untuk menghindari pembagian dengan nol)
        $indexPerKm = $jarakdanharga->source->kendaraan->jeniskendaraan->indexperkm ?? 0;

        // 3. Hitung Biaya Bahan Bakar
        // Rumus: (($jarak * 2) / indexperkm) * harga_bbm
        $biayabahanbakar = 0;
        if ($indexPerKm > 0) {
            $biayabahanbakar = (($request->jarak * 2) / $indexPerKm) * $request->hargasolar;
        }

        // 4. Update data
        $inserjarak = $jarakdanharga->update([
            'jarak'             => $request->jarak,
            'hargaupah'         => $request->hargaupah,
            'hargajasa'         => $request->hargajasa,
        ]);

        if ($inserjarak) {
            KegiatanArmada::where('jarak_id', $request->id)
                ->update([
                    'hargasolar'            => $request->hargasolar,
                    'nominalbiayasolar'     => $biayabahanbakar
                ]);
        }

        return response()->json([
            'status'  => 200,
            'success' => true,
            'message' => 'Data berhasil dihitung dan diupdate.',
            'data'    => [
                'biayabahanbakar' => $biayabahanbakar,
                'index_digunakan' => $indexPerKm
            ]
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
