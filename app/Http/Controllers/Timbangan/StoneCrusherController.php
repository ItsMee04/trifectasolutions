<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use Illuminate\Http\Request;

class StoneCrusherController extends Controller
{
    public function getStoneCrusher(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = StoneCrusher::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data SC tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data SC berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeStoneCrusher(Request $request)
    {
        $request->validate([
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'volume'            => 'required',
            'berattotal'        => 'required',
            'beratkendaraan'    => 'required',
            'beratmuatan'       => 'required'
        ]);

        $stonecrusher = StoneCrusher::create([
            'tanggal'       => $request->tanggal,
            'material_id'   => $request->material,
            'kendaraan_id'  => $request->kendaraan,
            'driver_id'     => $request->driver,
            'suplier_id'    => $request->suplier,
            'jenis'         => $request->jenis,
            'volume'        => $request->volume,
            'berattotal'    => $request->berattotal,
            'beratkendaraan' => $request->beratkendaraan,
            'beratmuatan'   => $request->beratmuatan,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data Stone Crusher berhasil disimpan",
            'data'      => $stonecrusher,
        ]);
    }

    public function updateStoneCrusher(Request $request)
    {
        $request->validate([
            'tanggal'           => 'required|date',
            'material'          => 'required|exists:material,id',
            'kendaraan'         => 'required|exists:kendaraan,id',
            'driver'            => 'required|exists:driver,id',
            'suplier'           => 'required|exists:suplier,id',
            'volume'            => 'required',
            'berattotal'        => 'required',
            'beratkendaraan'    => 'required',
            'beratmuatan'       => 'required'
        ]);

        $stonecrusher = StoneCrusher::find($request->id);

        if (!$stonecrusher) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Stone Crusher tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $stonecrusher->update([
            'tanggal'           => $request->tanggal,
            'material_id'       => $request->material,
            'kendaraan_id'      => $request->kendaraan,
            'driver_id'         => $request->driver,
            'suplier_id'        => $request->suplier,
            'jenis'             => $request->jenis,
            'volume'            => $request->volume,
            'berattotal'        => $request->berattotal,
            'beratkendaraan'    => $request->beratkendaraan,
            'beratmuatan'       => $request->beratmuatan,
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data Stone Crusher berhasil di updated.',
            'data' => $stonecrusher
        ], 200);
    }

    public function deleteStoneCrusher(Request $request)
    {
        $stonecrusher = StoneCrusher::find($request->id);
        if (!$stonecrusher) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Stone Crusher tidak ditemukan',
                'data'      => null
            ]);
        }

        $stonecrusher->status = 0; // Soft delete
        $stonecrusher->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Stone Crusher berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
