<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use App\Http\Controllers\Controller;

class SuplierController extends Controller
{
    public function getSuplier()
    {
        $data = Suplier::where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message' => 'Data suplier / customer tidak ditemukan.',
                'data' => [],
            ]);
        }
        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message' => 'Data suplier / customer berhasil ditemukan.',
            'data' => $data,
        ], 200);
    }

    public function storeSuplier(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'required|string|max:255',
            'alamat'    => 'required|string|max:500',
        ]);

        $suplier = Suplier::create([
            'nama' => strtoupper($request->nama),
            'kontak' => strtoupper($request->kontak),
            'alamat' => strtoupper($request->alamat),
        ]);

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Data suplier / customer berhasil disimpan.',
            'data' => $suplier
        ], 201);
    }

    public function updateSuplier(Request $request)
    {
        $suplier = Suplier::find($request->id);

        if (!$suplier) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data suplier / customer tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'required|string|max:255',
            'alamat'    => 'required|string|max:500',
        ]);

        $suplier->update([
            'nama' => strtoupper($request->nama),
            'kontak' => strtoupper($request->kontak),
            'alamat' => strtoupper($request->alamat),
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data suplier / customer berhasil diupdate.',
            'data' => $suplier
        ], 200);
    }

    public function deleteSuplier(Request $request)
    {
        $suplier = Suplier::find($request->id);

        if (!$suplier) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data suplier / customer tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $suplier->update(['status' => 0]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data suplier / customer berhasil dihapus.',
            'data' => null
        ], 200);
    }
}
