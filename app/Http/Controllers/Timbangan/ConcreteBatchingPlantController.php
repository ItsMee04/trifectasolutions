<?php

namespace App\Http\Controllers\Timbangan;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\ConcreteBatchingPlant;

class ConcreteBatchingPlantController extends Controller
{
    public function getConcreteBatchingPlant(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = ConcreteBatchingPlant::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier','beratjenis'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data CBP tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data CBP berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeConcreteBatchingPlant(Request $request)
    {
        $request->validate([
            'tanggal'        => 'required|date',
            'material'       => 'required|exists:material,id',
            'kendaraan'      => 'required|exists:kendaraan,id',
            'driver'         => 'required|exists:driver,id',
            'suplier'        => 'required|exists:suplier,id',
            'beratjenis'     => 'required|exists:beratjenis,id',
            'jenis'          => 'required|in:IN,OUT',
            'volume'         => 'required|numeric',
            'berattotal'     => 'required|numeric',
            'beratkendaraan' => 'required|numeric',
            'beratmuatan'    => 'required|numeric',
            'jarakawal'      => 'required|integer',
            'jarakakhir'     => 'required|integer'
        ]);

        try {
            $data = DB::transaction(function () use ($request) {
                // 1. Ambil Nama Supplier
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Simpan ke ConcreteBatchingPlant (Master Source)
                $cbp = ConcreteBatchingPlant::create([
                    'tanggal'        => $request->tanggal,
                    'material_id'    => $request->material,
                    'kendaraan_id'   => $request->kendaraan,
                    'driver_id'      => $request->driver,
                    'suplier_id'     => $request->suplier,
                    'beratjenis_id'  => $request->beratjenis,
                    'jenis'          => $request->jenis,
                    'volume'         => $request->volume,
                    'berattotal'     => $request->berattotal,
                    'beratkendaraan' => $request->beratkendaraan,
                    'beratmuatan'    => $request->beratmuatan,
                    'jarakawal'      => $request->jarakawal,
                    'jarakakhir'     => $request->jarakakhir,
                    'oleh'           => Auth::user()->id,
                ]);

                // 3. Logika Lokasi untuk CBP
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS CBP";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS CBP" : $suplier->nama;

                // 4. Simpan ke JarakDanHarga (Chaining Level 1)
                // Morph relation: source_id & source_type terisi otomatis
                $jarakHarga = $cbp->jarakHarga()->create([
                    'tanggal'     => $request->tanggal,
                    'pengambilan' => $pengambilan,
                    'tujuan'      => $tujuan,
                    'jarak'       => $request->jarak,
                    'oleh'        => Auth::user()->id,
                ]);

                // 5. Simpan ke KegiatanArmada (Chaining Level 2)
                // Menggunakan instance $jarakHarga agar jarak_id terhubung sempurna
                $jarakHarga->kegiatanArmada()->create([
                    'tanggal' => $request->tanggal,
                    'oleh'    => Auth::user()->id,
                ]);

                return $cbp;
            });

            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => "Data CBP, Jarak, dan Kegiatan Armada berhasil disinkronkan",
                'data'    => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => "Gagal menyimpan data berantai: " . $e->getMessage(),
            ], 500);
        }
    }

    public function updateConcreteBatchingPlant(Request $request)
    {
        $request->validate([
            'id'                => 'required|exists:concretebatchingplant,id',
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'beratjenis'        => 'required|exists:beratjenis,id',
            'jenis'             => 'required|in:IN,OUT',
            'volume'            => 'required|numeric',
            'berattotal'        => 'required|numeric',
            'beratkendaraan'    => 'required|numeric',
            'beratmuatan'       => 'required|numeric',
            'jarakawal'         => 'required|integer',
            'jarakakhir'        => 'required|integer',
        ]);

        // Ambil data beserta relasi Jarak dan Kegiatan
        $cbp = ConcreteBatchingPlant::with('jarakHarga.kegiatanArmada')->find($request->id);

        if (!$cbp) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data tidak ditemukan.',
            ], 404);
        }

        try {
            DB::transaction(function () use ($request, $cbp) {
                // 1. Ambil Nama Supplier terbaru
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Update Master CBP
                $cbp->update([
                    'tanggal'        => $request->tanggal,
                    'material_id'    => $request->material,
                    'kendaraan_id'   => $request->kendaraan,
                    'driver_id'      => $request->driver,
                    'suplier_id'     => $request->suplier,
                    'beratjenis_id'  => $request->beratjenis,
                    'jenis'          => $request->jenis,
                    'volume'         => $request->volume,
                    'berattotal'     => $request->berattotal,
                    'beratkendaraan' => $request->beratkendaraan,
                    'beratmuatan'    => $request->beratmuatan,
                    'jarakawal'      => $request->jarakawal,
                    'jarakakhir'     => $request->jarakakhir,
                ]);

                // 3. Tentukan ulang Pengambilan & Tujuan jika Jenis/Supplier berubah
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS CBP";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS CBP" : $suplier->nama;

                // 4. Update JarakHarga terkait (Polymorphic)
                if ($cbp->jarakHarga) {
                    $cbp->jarakHarga->update([
                        'tanggal'     => $request->tanggal,
                        'pengambilan' => $pengambilan,
                        'tujuan'      => $tujuan,
                        'jarak'       => $request->jarak
                    ]);

                    // 5. Update Tanggal di KegiatanArmada terkait
                    if ($cbp->jarakHarga->kegiatanArmada) {
                        $cbp->jarakHarga->kegiatanArmada->update([
                            'tanggal' => $request->tanggal
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => 200,
                'success' => true,
                'message' => 'Data CBP dan relasi logistik berhasil diperbarui.',
                'data' => $cbp
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteConcreteBatchingPlant(Request $request)
    {
        // 1. Cari data AMP utama
        $data = ConcreteBatchingPlant::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data CBP tidak ditemukan',
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
