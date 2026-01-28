<?php

namespace App\Http\Controllers\KegiatanArmada;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\KegiatanArmada\KegiatanArmada;

class JarakDanHargaController extends Controller
{
    public function getJarakDanHarga()
    {
        $data = JarakHarga::where('status', 1)->with('material')->get();

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

    public function storeJarakDanHarga(Request $request)
    {
        $request->validate([
            'material'      => 'required|exists:material,id',
            'pengambilan'   => 'required|string|max:100',
            'tujuan'        => 'required|string|max:100',
            'jarak'         => 'required|integer|min:0',
            'hargaupah'     => 'required|integer|min:0',
            'hargajasa'     => 'required|integer|min:0',
        ]);

        DB::beginTransaction();

        try {
            $jarakDanHarga = JarakHarga::create([
                'tanggal'       => Carbon::now(),
                'material_id'   => $request->material,
                'pengambilan'   => strtoupper($request->pengambilan),
                'tujuan'        => strtoupper($request->tujuan),
                'jarak'         => $request->jarak,
                'hargaupah'     => $request->hargaupah,
                'hargajasa'     => $request->hargajasa,
            ]);

            // Pastikan $jarakDanHarga berhasil dibuat
            if (!$jarakDanHarga) {
                throw new \Exception('Gagal membuat data jarak dan harga');
            }

            $kegiatanArmada = KegiatanArmada::create([
                'tanggal'   => Carbon::now(),
                'jarak_id'  => $jarakDanHarga->id,
            ]);

            DB::commit();

            return response()->json([
                'status'    => 201,
                'success'   => true,
                'message'   => 'Data Jarak dan Harga beserta Kegiatan Armada berhasil disimpan.',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status'    => 500,
                'success'   => false,
                'message'   => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateJarakDanHarga(Request $request)
    {
        $jarakdanharga = JarakHarga::find($request->id);

        if (!$jarakdanharga) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jarak & harga tidak ditemukan.',
            ]);
        }

        $request->validate([
            'material'      => 'required|exists:material,id',
            'pengambilan'   => 'required|string|max:255',
            'tujuan'        => 'required|string|max:255',
            'jarak'         => 'required|integer',
            'hargaupah'     => 'required|integer',
            'hargajasa'     => 'required|integer',
        ]);

        $jarakdanharga->update([
            'material'      => $request->material,
            'pengambilan'   => strtoupper($request->pengambilan),
            'tujuan'        => strtoupper($request->tujuan),
            'jarak'         => $request->jarak,
            'hargaupah'     => $request->hargaupah,
            'hargajasa'     => $request->hargajasa,
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jarak & harga berhasil diubah.',
            'data' => $jarakdanharga
        ], 200);
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
            'message' => 'Material deleted successfully.',
        ], 200);
    }
}
