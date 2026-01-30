<?php

namespace App\Http\Controllers\Timbangan;

use Illuminate\Http\Request;
use App\Models\Master\Suplier;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\AsphaltMixingPlant;

class AsphaltMixingPlantController extends Controller
{
    public function getAsphaltMixingPlant(Request $request)
    {
        $request->validate([
            'jenis' => 'required'
        ]);

        $data = AsphaltMixingPlant::where('status', 1)
            ->where('jenis', $request->jenis)
            ->with(['material', 'kendaraan', 'driver', 'suplier'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => "Data AMP tidak ditemukan",
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => "Data AMP berhasil ditemukan",
            'data'      => $data,
        ]);
    }

    public function storeAsphaltMixingPlant(Request $request)
    {
        $request->validate([
            'tanggal'        => 'required|date',
            'material'       => 'required|exists:material,id',
            'kendaraan'      => 'required|exists:kendaraan,id',
            'driver'         => 'required|exists:driver,id',
            'suplier'        => 'required|exists:suplier,id',
            'jenis'          => 'required|in:IN,OUT',
            'volume'         => 'required|numeric',
            'berattotal'     => 'required|numeric',
            'beratkendaraan' => 'required|numeric',
            'beratmuatan'    => 'required|numeric'
        ]);

        try {
            $data = DB::transaction(function () use ($request) {
                // 1. Ambil Nama Supplier
                $suplier = Suplier::findOrFail($request->suplier);

                // 2. Simpan ke AsphaltMixingPlant
                $amp = AsphaltMixingPlant::create([
                    'tanggal'        => $request->tanggal,
                    'material_id'    => $request->material,
                    'kendaraan_id'   => $request->kendaraan,
                    'driver_id'      => $request->driver,
                    'suplier_id'     => $request->suplier,
                    'jenis'          => $request->jenis,
                    'volume'         => $request->volume,
                    'berattotal'     => $request->berattotal,
                    'beratkendaraan' => $request->beratkendaraan,
                    'beratmuatan'    => $request->beratmuatan,
                ]);

                // 3. Logika Penentuan Pengambilan & Tujuan untuk AMP
                $pengambilan = ($request->jenis == 'IN') ? $suplier->nama : "SBPS AMP";
                $tujuan      = ($request->jenis == 'IN') ? "SBPS AMP" : $suplier->nama;

                // 4. Simpan ke JarakDanHarga (Polymorphic)
                $amp->jarakHarga()->create([
                    'kode'        => 'AMP-' . strtoupper(bin2hex(random_bytes(3))),
                    'tanggal'     => $request->tanggal,
                    'material_id' => $request->material,
                    'pengambilan' => $pengambilan,
                    'tujuan'      => $tujuan,
                ]);

                return $amp;
            });

            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => "Data AMP berhasil disimpan",
                'data'    => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => "Gagal menyimpan data: " . $e->getMessage(),
            ], 500);
        }
    }

    public function updateAsphaltMixingPlant(Request $request)
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

        $data = AsphaltMixingPlant::find($request->id);

        if (!$data) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data AMP tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $data->update([
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
            'message' => 'Data AMP berhasil di updated.',
            'data' => $data
        ], 200);
    }

    public function deleteAsphaltMixingPlant(Request $request)
    {
        $data = AsphaltMixingPlant::find($request->id);
        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data AMP tidak ditemukan',
                'data'      => null
            ]);
        }

        $data->status = 0; // Soft delete
        $data->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data AMP berhasil dihapus',
            'data'      => null
        ], 200);
    }
}
