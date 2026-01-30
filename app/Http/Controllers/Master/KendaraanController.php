<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Kendaraan;
use App\Http\Controllers\Controller;

class KendaraanController extends Controller
{
    public function getKendaraan()
    {
        $data = Kendaraan::where('status', 1)->with(['bahanbakar'])->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message' => 'No active vehicles found.',
                'data' => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message' => 'Active vehicles retrieved successfully.',
            'data' => $data
        ], 200);
    }

    public function storeKendaraan(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'kode'          => 'required|string|max:100',
            'kendaraan'     => 'required|string|max:100',
            'jenis'         => 'required|exists:bahanbakar,id',
            'nomor'         => 'required|string',
        ]);

        // 2. Simpan data
        $kendaraan = new Kendaraan();
        $kendaraan->kode        = strtoupper($request->input('kode'));
        $kendaraan->kendaraan   = strtoupper($request->input('kendaraan'));
        $kendaraan->jenis_id    = strtoupper($request->input('jenis'));
        $kendaraan->nomor       = strtoupper($request->input('nomor'));
        $kendaraan->save();

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Kendaraan created successfully',
            'data'      => $kendaraan
        ], 201);
    }

    public function updateKendaraan(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'kode'  => 'required|string|max:100',
            'kendaraan'  => 'required|string|max:100',
            'jenis' => 'required|exists:bahanbakar,id',
            'nomor' => 'required|string',
        ]);

        // 2. Update data
        $kendaraan = Kendaraan::find($request->id);
        if (!$kendaraan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Kendaraan not found',
                'data'      => null
            ]);
        }

        $kendaraan->kode        = strtoupper($request->input('kode'));
        $kendaraan->kendaraan   = strtoupper($request->input('kendaraan'));
        $kendaraan->jenis_id    = $request->input('jenis');
        $kendaraan->nomor       = strtoupper($request->input('nomor'));
        $kendaraan->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Kendaraan updated successfully',
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
                'message'   => 'Kendaraan not found',
                'data'      => null
            ]);
        }

        $kendaraan->status = 0; // Soft delete
        $kendaraan->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Kendaraan deleted successfully',
            'data'      => null
        ], 200);
    }
}
