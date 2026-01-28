<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Models\Timbangan\ConcreteBatchingPlant;
use Illuminate\Http\Request;

class ConcreteBatchingPlantController extends Controller
{
    public function getConcreteBatchingPlant(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = ConcreteBatchingPlant::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data CBP tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data CBP berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeConcreteBatchingPlant(Request $request)
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

        $ConcreteBatchingPlant = ConcreteBatchingPlant::create([
            'tanggal'       => $request->tanggal,
            'material_id'   => $request->material,
            'kendaraan_id'  => $request->kendaraan,
            'driver_id'     => $request->driver,
            'suplier_id'    => $request->suplier,
            'jenis'         => $request->jenis,
            'volume'        => $request->volume,
            'berattotal'    => $request->berattotal,
            'beratkendaraan'=> $request->beratkendaraan,
            'beratmuatan'   => $request->beratmuatan,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data Concrete Batching Plant berhasil disimpan",
            'data'      => $ConcreteBatchingPlant,
        ]);
    }

    public function updateConcreteBatchingPlant(Request $request)
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

        $ConcreteBatchingPlant = ConcreteBatchingPlant::find($request->id);

        if (!$ConcreteBatchingPlant) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Concrete Batching Plant tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $ConcreteBatchingPlant->update([
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
            'message' => 'Data Concrete Batching Plant berhasil di updated.',
            'data' => $ConcreteBatchingPlant
        ], 200);
    }

    public function deleteConcreteBatchingPlant(Request $request)
    {
        $ConcreteBatchingPlant = ConcreteBatchingPlant::find($request->id);
        if (!$ConcreteBatchingPlant) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Concrete Batching Plant tidak ditemukan',
                'data'      => null
            ]);
        }

        $ConcreteBatchingPlant->status = 0; // Soft delete
        $ConcreteBatchingPlant->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Concrete Batching Plant berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
