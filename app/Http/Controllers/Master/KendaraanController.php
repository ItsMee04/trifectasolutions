<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Kendaraan;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class KendaraanController extends Controller
{
    public function getKendaraan()
    {
        $data = Kendaraan::where('status', 1)->with(['jeniskendaraan'])->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message' => 'Data kendaraan tidak ditemukan.',
                'data' => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message' => 'Data kendaraan berhasil ditemukan.',
            'data' => $data
        ], 200);
    }

    public function storeKendaraan(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'kode'          => 'required|string|max:100',
            'kendaraan'     => 'required|string|max:100',
            'jenis'         => 'required|exists:jeniskendaraan,id',
            'nomor'         => 'required|string',
        ]);

        // 2. Simpan data
        $kendaraan = new Kendaraan();
        $kendaraan->kode                = strtoupper($request->input('kode'));
        $kendaraan->kendaraan           = strtoupper($request->input('kendaraan'));
        $kendaraan->jeniskendaraan_id   = strtoupper($request->input('jenis'));
        $kendaraan->nomor               = strtoupper($request->input('nomor'));
        $kendaraan->oleh                = Auth::user()->id;
        $kendaraan->save();

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil disimpan',
            'data'      => $kendaraan
        ], 201);
    }

    public function updateKendaraan(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'kode'          => 'required|string|max:100',
            'kendaraan'     => 'required|string|max:100',
            'jenis'         => 'required|exists:jeniskendaraan,id',
            'nomor'         => 'required|string',
        ]);

        // 2. Update data
        $kendaraan = Kendaraan::find($request->id);
        if (!$kendaraan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kendaraan tidak ditemukan',
                'data'      => null
            ]);
        }

        $kendaraan->kode                = strtoupper($request->input('kode'));
        $kendaraan->kendaraan           = strtoupper($request->input('kendaraan'));
        $kendaraan->jeniskendaraan_id   = $request->input('jenis');
        $kendaraan->nomor               = strtoupper($request->input('nomor'));
        $kendaraan->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil diupdate',
            'data'      => $kendaraan
        ], 200);
    }

    public function deleteKendaraan(Request $request)
    {
        $kendaraan = Kendaraan::find($request->id);
        if (!$kendaraan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kendaraan tidak ditemukan',
                'data'      => null
            ]);
        }

        $kendaraan->status = 0; // Soft delete
        $kendaraan->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
