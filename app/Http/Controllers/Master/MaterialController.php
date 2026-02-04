<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Material;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    public function getMaterial()
    {
        $data = Material::where('status', '1')->with('kategori')->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data material tidak ditemukan.',
                'data'      => []
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data material berhasil ditemukan.',
            'data' => $data
        ], 200);
    }

    public function storeMaterial(Request $request)
    {
        $request->validate([
            'kategori'      => 'required|exists:kategori,id',
            'material'      => 'required|string|max:255',
            'satuan'        => 'required|string',
        ]);

        $material = Material::create([
            'kategori_id'   => $request->kategori,
            'material'      => strtoupper($request->material),
            'satuan'        => strtoupper($request->satuan),
            'oleh'          => Auth::user()->id,
        ]);

        return response()->json([
            'status'        => 201,
            'success'       => true,
            'message'       => 'Data material berhasil disimpan.',
            'data'          => $material
        ], 201);
    }

    public function updateMaterial(Request $request)
    {
        $material = Material::find($request->id);

        if (!$material) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Material tidak ditemukan.',
            ]);
        }

        $request->validate([
            'kategori' => 'required|exists:kategori,id',
            'material' => 'required|string|max:255',
            'satuan'   => 'required|string',
        ]);

        $material->update([
            'kategori_id'   => $request->kategori,
            'material'      => strtoupper($request->material),
            'satuan'        => strtoupper($request->satuan),
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data material berhasil diupdate.',
            'data' => $material
        ], 200);
    }

    public function deleteMaterial(Request $request)
    {
        $material = Material::find($request->id);

        if (!$material) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data material tidak ditemukan.',
            ]);
        }

        $material->update(['status' => 0]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data material berhasil dihapus.',
        ], 200);
    }
}
