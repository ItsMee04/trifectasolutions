<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\JenisKendaraan;
use Illuminate\Http\Request;

class JenisKendaraanController extends Controller
{
    public function getJenisKendaraan()
    {
        $data = JenisKendaraan::where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis kendaraan tidak ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil ditemukan',
            'data'      => $data
        ]);
    }

    public function storeJenisKendaraan(Request $request)
    {
        $request->validate([
            'jenis'         => 'required',
            'indexperkm'    => 'required|integer'
        ]);

        $data = JenisKendaraan::create([
            'jenis'         => strtoupper($request->jenis),
            'indexperkm'    => $request->indexperkm,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil disimpan',
            'data'      => $data
        ]);
    }

    public function updateJenisKendaraan(Request $request)
    {
        $request->validate([
            'jenis' => 'required',
            'indexperkm'    => 'required|integer'
        ]);

        $data = JenisKendaraan::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 400,
                'success'   => false,
                'message'   => 'Data jenis kendaraan tidak ditemukan',
            ]);
        }

        $data->update([
            'jenis' => strtoupper($request->jenis),
            'indexperkm'    => $request->indexperkm
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan Berhasil Diupdate',
            'Data'      => $data
        ]);
    }

    public function deleteJenisKendaraan(Request $request)
    {
        $data = JenisKendaraan::find($request->id);

        if (!$data) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jenis kendaraan tidak ditemukan.',
                'data' => null
            ]);
        }

        $data->update(['status' => '0']);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jenis kendaraan berhasil dihapus.',
            'data' => null
        ], 200);
    }
}
