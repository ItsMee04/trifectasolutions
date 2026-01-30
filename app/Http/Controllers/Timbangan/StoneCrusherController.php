<?php

namespace App\Http\Controllers\Timbangan;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\Master\BahanBakar;
use App\Models\Master\Kendaraan;

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
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'volume'            => 'required',
            'berattotal'        => 'required',
            'beratkendaraan'    => 'required',
            'beratmuatan'       => 'required'
        ]);

        $stonecrusher = StoneCrusher::find($request->id);

        if (!$stonecrusher) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Stone Crusher tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $stonecrusher->update([
            'tanggal'           => $request->tanggal,
            'material_id'       => $request->material,
            'kendaraan_id'      => $request->kendaraan,
            'driver_id'         => $request->driver,
            'suplier_id'        => $request->suplier,
            'jenis'             => $request->jenis,
            'volume'            => $request->volume,
            'berattotal'        => $request->berattotal,
            'beratkendaraan'    => $request->beratkendaraan,
            'beratmuatan'       => $request->beratmuatan,
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data Stone Crusher berhasil di updated.',
            'data' => $stonecrusher
        ], 200);
    }

    public function deleteStoneCrusher(Request $request)
    {
        $stonecrusher = StoneCrusher::find($request->id);
        if (!$stonecrusher) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Stone Crusher tidak ditemukan',
                'data'      => null
            ]);
        }

        $stonecrusher->status = 0; // Soft delete
        $stonecrusher->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Stone Crusher berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
