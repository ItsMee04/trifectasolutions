<?php

namespace App\Http\Controllers\Timbangan;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use App\Models\Master\Kendaraan;
use App\Models\Master\BahanBakar;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\KegiatanArmada\KegiatanArmada;

class StoneCrusherController extends Controller
{
    public function getStoneCrusher(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = StoneCrusher::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data SC tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data SC berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeStoneCrusher(Request $request)
    {
        $request->validate([
            'tanggal'        => 'required|date',
            'material'       => 'required|exists:material,id',
            'kendaraan'      => 'required|exists:kendaraan,id',
            'driver'         => 'required|exists:driver,id',
            'suplier'        => 'required|exists:suplier,id',
            'jenis'          => 'required|in:IN,OUT',
            'volume'         => 'required|numeric',
            'berattotal'     => 'required|numeric',
            'beratkendaraan' => 'required|numeric',
            'beratmuatan'    => 'required|numeric'
        ]);

        try {
            $data = DB::transaction(function () use ($request) {
                // 1. Ambil Nama Supplier
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Simpan ke StoneCrusher
                $stonecrusher = StoneCrusher::create([
                    'tanggal'        => $request->tanggal,
                    'material_id'    => $request->material,
                    'kendaraan_id'   => $request->kendaraan,
                    'driver_id'      => $request->driver,
                    'suplier_id'     => $request->suplier,
                    'jenis'          => $request->jenis,
                    'volume'         => $request->volume,
                    'berattotal'     => $request->berattotal,
                    'beratkendaraan' => $request->beratkendaraan,
                    'beratmuatan'    => $request->beratmuatan,
                ]);

                // 3. Logika Penentuan Pengambilan & Tujuan
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS SC";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS SC" : $suplier->nama;

                // 4. Simpan ke JarakHarga & KegiatanArmada secara berantai (Chaining)
                // Kita simpan instance jarakHarga ke variabel agar bisa ambil ID-nya
                $jarakHarga = $stonecrusher->jarakHarga()->create([
                    'tanggal'     => $request->tanggal,
                    'pengambilan' => $pengambilan,
                    'tujuan'      => $tujuan,
                ]);

                // 5. Simpan ke KegiatanArmada menggunakan ID dari JarakHarga yang baru dibuat
                $jarakHarga->kegiatanArmada()->create([
                    'tanggal' => $request->tanggal,
                    // 'jarak_id' akan otomatis terisi oleh Eloquent
                ]);

                return $stonecrusher;
            });

            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => "Data Stone Crusher dan Kegiatan Armada berhasil disimpan",
                'data'    => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => "Gagal menyimpan data: " . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStoneCrusher(Request $request)
    {
        $request->validate([
            'id'                => 'required|exists:stonecrusher,id',
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'jenis'             => 'required|in:IN,OUT',
            'volume'            => 'required|numeric',
            'berattotal'        => 'required|numeric',
            'beratkendaraan'    => 'required|numeric',
            'beratmuatan'       => 'required|numeric'
        ]);

        // Load relasi agar proses update lebih efisien
        $stonecrusher = StoneCrusher::with('jarakHarga.kegiatanArmada')->find($request->id);

        if (!$stonecrusher) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Stone Crusher tidak ditemukan.',
            ], 404);
        }

        try {
            DB::transaction(function () use ($request, $stonecrusher) {
                // 1. Ambil Nama Supplier terbaru
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Update Master Stone Crusher
                $stonecrusher->update([
                    'tanggal'        => $request->tanggal,
                    'material_id'    => $request->material,
                    'kendaraan_id'   => $request->kendaraan,
                    'driver_id'      => $request->driver,
                    'suplier_id'     => $request->suplier,
                    'jenis'          => $request->jenis,
                    'volume'         => $request->volume,
                    'berattotal'     => $request->berattotal,
                    'beratkendaraan' => $request->beratkendaraan,
                    'beratmuatan'    => $request->beratmuatan,
                ]);

                // 3. Logika Lokasi untuk Stone Crusher (SBPS SC)
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS SC";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS SC" : $suplier->nama;

                // 4. Update JarakHarga terkait
                if ($stonecrusher->jarakHarga) {
                    $stonecrusher->jarakHarga->update([
                        'tanggal'     => $request->tanggal,
                        'pengambilan' => $pengambilan,
                        'tujuan'      => $tujuan,
                    ]);

                    // 5. Update Tanggal di KegiatanArmada terkait
                    if ($stonecrusher->jarakHarga->kegiatanArmada) {
                        $stonecrusher->jarakHarga->kegiatanArmada->update([
                            'tanggal' => $request->tanggal
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => 200,
                'success' => true,
                'message' => 'Data Stone Crusher dan relasi logistik berhasil diperbarui.',
                'data' => $stonecrusher
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteStoneCrusher(Request $request)
    {
        // 1. Cari data AMP utama
        $data = StoneCrusher::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data SC tidak ditemukan',
            ]);
        }

        // 2. Gunakan Transaction agar jika salah satu gagal, semua dibatalkan
        DB::transaction(function () use ($data) {
            // A. Update status AMP itu sendiri
            $data->update(['status' => 0]);

            // B. Update status JarakHarga yang terhubung (Polymorphic)
            // Kita ambil ID jarak untuk update KegiatanArmada nantinya
            $jarakIds = JarakHarga::where('source_type', get_class($data))
                ->where('source_id', $data->id)
                ->pluck('id');

            if ($jarakIds->isNotEmpty()) {
                // Update status semua JarakHarga terkait
                JarakHarga::whereIn('id', $jarakIds)->update(['status' => 0]);

                // C. Update status KegiatanArmada yang terhubung dengan Jarak tersebut
                KegiatanArmada::whereIn('jarak_id', $jarakIds)->update(['status' => 0]);
            }
        });

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data AMP dan relasi terkait berhasil dinonaktifkan',
        ], 200);
    }
}
