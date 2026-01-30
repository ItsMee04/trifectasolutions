<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\BahanBakar;
use Illuminate\Http\Request;

class BahanBakarController extends Controller
{
    public function getBahanBakar()
    {
        $data = BahanBakar::where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Bahan Bakar tidak ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Bahan Bakar berhasil ditemukan',
            'data'      => $data
        ]);
    }

    public function storeBahanBakar(Request $request)
    {
        $request->validate([
            'jenis'         => 'required',
            'indexperkm'    => 'required|integer'
        ]);

        $data = BahanBakar::create([
            'jenis'         => strtoupper($request->jenis),
            'indexperkm'    => $request->indexperkm,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Bahan Bakar berhasil disimpan',
            'data'      => $data
        ]);
    }

    public function updateBahanBakar(Request $request)
    {
        $request->validate([
            'jenis' => 'required',
            'indexperkm'    => 'required|integer'
        ]);

        $data = BahanBakar::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 400,
                'success'   => false,
                'message'   => 'Data Bahan Bakar tidak ditemukan',
            ]);
        }

        $data->update([
            'jenis' => strtoupper($request->jenis),
            'indexperkm'    => $request->indexperkm
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Berhasil Diupdate',
            'Data'      => $data
        ]);
    }

    public function deleteBahanBakar(Request $request)
    {
        $data = BahanBakar::find($request->id);

        if (!$data) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Bahan Bakar tidak ditemukan.',
                'data' => null
            ]);
        }

        $data->update(['status' => '0']);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data Bahan Bakar berhasil dihapus.',
            'data' => null
        ], 200);
    }
}
