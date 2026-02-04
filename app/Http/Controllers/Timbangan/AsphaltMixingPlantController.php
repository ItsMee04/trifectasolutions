<?php

namespace App\Http\Controllers\Timbangan;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\KegiatanArmada\KegiatanArmada;

class AsphaltMixingPlantController extends Controller
{
    public function getAsphaltMixingPlant(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = AsphaltMixingPlant::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier','beratjenis'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data AMP tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data AMP berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeAsphaltMixingPlant(Request $request)
    {
        $request->validate([
            'tanggal'        => 'required|date',
            'material'       => 'required|exists:material,id',
            'kendaraan'      => 'required|exists:kendaraan,id',
            'driver'         => 'required|exists:driver,id',
            'suplier'        => 'required|exists:suplier,id',
            'beratjenis'     => 'nullable|exists:beratjenis,id',
            'jenis'          => 'required|in:IN,OUT',
            'volume'         => 'required|numeric',
            'berattotal'     => 'required|numeric',
            'beratkendaraan' => 'required|numeric',
            'beratmuatan'    => 'required|numeric',
            'jarakawal'      => 'required|integer',
            'jarakakhir'     => 'required|integer',
        ]);

        try {
            $data = DB::transaction(function () use ($request) {
                // 1. Ambil Nama Supplier untuk kebutuhan teks pengambilan/tujuan
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Simpan ke AsphaltMixingPlant (Tabel Utama)
                $amp = AsphaltMixingPlant::create([
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

                // 3. Logika Penentuan Lokasi (Basecamp AMP biasanya disebut SBPS AMP)
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS AMP";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS AMP" : $suplier->nama;

                // 4. Simpan ke JarakDanHarga (Polymorphic Chaining)
                // Sesuai diskusi sebelumnya, material_id tidak perlu diinput di sini
                $jarakHarga = $amp->jarakHarga()->create([
                    'tanggal'     => $request->tanggal,
                    'pengambilan' => $pengambilan,
                    'tujuan'      => $tujuan,
                    'jarak'       => $request->jarak, // Nilai awal sebelum diedit
                    'hargaupah'   => 0,
                    'hargajasa'   => 0,
                    'oleh'        => Auth::user()->id,
                ]);

                // 5. Simpan ke KegiatanArmada (Chaining level 2)
                // Eloquent akan otomatis mengisi jarak_id menggunakan ID dari $jarakHarga
                $jarakHarga->kegiatanArmada()->create([
                    'tanggal'   => $request->tanggal,
                    'oleh'      => Auth::user()->id,
                ]);

                return $amp;
            });

            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => "Data AMP, Jarak, dan Kegiatan Armada berhasil disimpan secara berantai",
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

    public function updateAsphaltMixingPlant(Request $request)
    {
        $request->validate([
            'id'                => 'required|exists:asphaltmixingplant,id',
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'beratjenis'        => 'nullable|exists:beratjenis,id',
            'jenis'             => 'required|in:IN,OUT',
            'volume'            => 'required|numeric',
            'berattotal'        => 'required|numeric',
            'beratkendaraan'    => 'required|numeric',
            'beratmuatan'       => 'required|numeric',
            'jarakawal'         => 'required|integer',
            'jarakakhir'        => 'required|integer'
        ]);

        // Eager load relasi untuk mempercepat proses update
        $amp = AsphaltMixingPlant::with('jarakHarga.kegiatanArmada')->find($request->id);

        if (!$amp) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data AMP tidak ditemukan.',
            ], 404);
        }

        try {
            DB::transaction(function () use ($request, $amp) {
                // 1. Ambil Nama Supplier terbaru
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Update Master AMP
                $amp->update([
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

                // 3. Logika Penentuan Lokasi Khusus AMP
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS AMP";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS AMP" : $suplier->nama;

                // 4. Update JarakHarga terkait (Polymorphic)
                if ($amp->jarakHarga) {
                    $amp->jarakHarga->update([
                        'tanggal'     => $request->tanggal,
                        'pengambilan' => $pengambilan,
                        'tujuan'      => $tujuan,
                        'jarak'       => $request->jarak,
                    ]);

                    // 5. Update Tanggal di KegiatanArmada terkait agar sinkron di laporan
                    if ($amp->jarakHarga->kegiatanArmada) {
                        $amp->jarakHarga->kegiatanArmada->update([
                            'tanggal' => $request->tanggal
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => 200,
                'success' => true,
                'message' => 'Data AMP dan relasi logistik berhasil diperbarui.',
                'data' => $amp
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAsphaltMixingPlant(Request $request)
    {
        // 1. Cari data AMP utama
        $data = AsphaltMixingPlant::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data AMP tidak ditemukan',
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
