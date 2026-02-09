<?php

namespace App\Http\Controllers\KegiatanArmada;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\ConcreteBatchingPlant;

class KegiatanArmadaController extends Controller
{
    public function getKegiatanArmada()
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

    public function updateKegiatanArmada(Request $request)
    {
        $request->validate([
            'id'                        => 'required|exists:kegiatanarmada,id',
            'rit'                       => 'required|numeric',
            'satuan'                    => 'required',
            'upahhariankenet'           => 'required|numeric',
            'umluarkotatelahterbayar'   => 'required|numeric',
            'umpengajuan'               => 'required|numeric',
            'insentifataulembur'        => 'required|numeric',
        ]);

        // 1. Gunakan relasi 'jarak' dan 'jarak.source' sesuai nama di model Anda
        $kegiatan = KegiatanArmada::with(['jarak.source'])->findOrFail($request->id);

        // 2. Keamanan: Cek apakah relasi jarak tersedia
        if (!$kegiatan->jarak) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Relasi Jarak tidak ditemukan. Pastikan jarak_id valid.'
            ], 404);
        }

        $jarakKegiatan = $kegiatan->jarak;
        $upahDriver = $jarakKegiatan->hargaupah;
        $hargaJasaAngkut = $jarakKegiatan->hargajasa;

        // 3. Ambil Volume dari source (SC/CBP/AMP)
        // Gunakan (float) dan pastikan source tidak null
        $volume = 0;
        if ($jarakKegiatan->source) {
            $volume = (float) $jarakKegiatan->source->volume;
        }

        // 4. Hitung UPAH & JUMLAH
        $upah = $upahDriver * $request->rit;
        $jumlah = $upah + $request->insentifataulembur + $request->umpengajuan + $request->upahhariankenet;

        // 5. Hitung PENJUALAN
        if ($request->satuan == "RIT") {
            $penjualan = $hargaJasaAngkut * $request->rit;
        } else {
            // Jika satuan selain RIT (misal M3), gunakan Volume dari source
            $penjualan = $hargaJasaAngkut * $request->rit * $volume;
        }

        // 6. Update data ke database
        $kegiatan->update([
            'rit'                       => $request->rit,
            'satuan'                    => strtoupper($request->satuan),
            'upahhariankenet'           => $request->upahhariankenet,
            'umluarkotatelahterbayar'   => $request->umluarkotatelahterbayar,
            'umpengajuan'               => $request->umpengajuan,
            'insentifataulembur'        => $request->insentifataulembur,
            'upah'                      => $upah,
            'jumlah'                    => $jumlah,
            'penjualan'                 => $penjualan, // Mengupdate volume di kegiatan jika ada kolomnya
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kegiatan armada berhasil diupdate',
            'data'      => $kegiatan
        ]);
    }

    public function deleteKegiatanArmada(Request $request)
    {
        $kegiatan = KegiatanArmada::find($request->id);

        if (!$kegiatan) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Kegiatan Armada tidak ditemukan.',
            ]);
        }

        $kegiatan->update(['status' => 0]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data kegiatan berhasil di hapus.',
        ], 200);
    }
}
