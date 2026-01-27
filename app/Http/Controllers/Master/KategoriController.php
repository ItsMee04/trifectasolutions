<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Kategori;
use App\Http\Controllers\Controller;

class KategoriController extends Controller
{
    public function getKategori()
    {
        $data = Kategori::where('status',1)->get();

        if($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Kategori tidak ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Kategori ditemukan',
            'data'      => $data
        ]);
    }

    public function storeKategori(Request $request)
    {
        $request->validate([
            'kategori'      => 'required|'
        ]);

        $kategori = Kategori::create([
            'kategori'      => strtoupper($request->kategori),
        ]);

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Kategori created successfully.',
            'data' => $kategori
        ], 201);
    }

    public function updateKategori(Request $request)
    {
        $request->validate([
            'kategori' => 'required|'
        ]);

        $kategori = Kategori::find($request->id);

        if (!$kategori) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Kategori not found.',
                'data' => null
            ], 404);
        }

        $kategori->kategori = strtoupper($request->kategori);
        $kategori->save();

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Kategori updated successfully.',
            'data' => $kategori
        ], 200);
    }

    public function deleteKategori(Request $request)
    {
        $kategori = Kategori::find($request->id);
        if (!$kategori) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Kategori tidak ditemukan',
                'data'      => null
            ]);
        }

        $kategori->status = 0; // Soft delete
        $kategori->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Kategori berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
