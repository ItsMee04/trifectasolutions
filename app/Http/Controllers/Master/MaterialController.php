<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Material;
use App\Http\Controllers\Controller;

class MaterialController extends Controller
{
    public function getMaterial()
    {
        $data = Material::where('status', '1')->with('kategori')->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'No active materials found.',
                'data'      => []
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Active materials retrieved successfully.',
            'data' => $data
        ], 200);
    }

    public function storeMaterial(Request $request)
    {
        $request->validate([
            'kategori'      => 'required|exists:kategori,id',
            'material'      => 'required|string|max:255',
        ]);

        $material = Material::create([
            'kategori_id'   => $request->kategori,
            'material'      => strtoupper($request->material),
        ]);

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Material berhasil disimpan.',
            'data' => $material
        ], 201);
    }

    public function updateMaterial(Request $request)
    {
        $material = Material::find($request->id);

        if (!$material) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Material not found.',
            ]);
        }

        $request->validate([
            'kategori' => 'required|exists:kategori,id',
            'material' => 'required|string|max:255',
        ]);

        $material->update([
            'kategori_id'   => $request->kategori,
            'material'      => strtoupper($request->material),
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Material berhasil diupdate.',
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
                'message' => 'Material tidak ditemukan.',
            ]);
        }

        $material->update(['status' => 0]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Material berhasil dihapus.',
        ], 200);
    }
}
