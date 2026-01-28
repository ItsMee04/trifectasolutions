<?php

namespace App\Http\Controllers\KegiatanArmada;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\KegiatanArmada\KegiatanArmada;

class KegiatanArmadaController extends Controller
{
    public function getKegiatanArmada(Request $request)
    {
        $data = KegiatanArmada::with(['jarak', 'jarak.material', 'kendaraan', 'driver'])->where('status', 1)->get();

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
            'kendaraan'                 => 'required|exists:kendaraan,id',
            'driver'                    => 'required|exists:driver,id',
            'rit'                       => 'required',
            'satuan'                    => 'required',
            'volume'                    => 'required',
            'upahhariankenet'           => 'required',
            'umluarkotatelahterbayar'   => 'required',
            'umpengajuan'               => 'required',
            'insentifataulembur'        => 'required',
        ]);

        $kegiatan = KegiatanArmada::find($request->id);
        $jarak = $kegiatan->jarak_id;

        $jarakKegiatan = JarakHarga::where('id', $kegiatan->jarak_id)->first();
        $upahDriver = $jarakKegiatan->hargaupah;
        $hargaJasaAngkut = $jarakKegiatan->hargajasa;

        // UPAH
        $upah = $upahDriver * $request->rit;
        $jumlah = $upah + $request->insentifataulembur + $request->umpengajuan + $request->upahhariankenet;

        if ($request->volume == 0) {
            $penjualan = $hargaJasaAngkut * 1;
        } else {
            $penjualan = $hargaJasaAngkut * $request->volume;
        }

        $kegiatan->update([
            'kendaraan_id'              => $request->kendaraan,
            'driver_id'                 => $request->driver,
            'rit'                       => $request->rit,
            'satuan'                    => $request->satuan,
            'volume'                    => $request->volume,
            'upahhariankenet'           => $request->upahhariankenet,
            'umluarkotatelahterbayar'   => $request->umluarkotatelahterbayar,
            'umpengajuan'               => $request->umpengajuan,
            'insentifataulembur'        => $request->insentifataulembur,
            'upah'                      => $upah,
            'jumlah'                    => $jumlah,
            'penjualan'                 => $penjualan,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kegiatan armada berhasil diupdate',
            'data'      => $penjualan
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
