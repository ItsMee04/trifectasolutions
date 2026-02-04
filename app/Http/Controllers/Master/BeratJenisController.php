<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\BeratJenis;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class BeratJenisController extends Controller
{
    public function getBeratJenis()
    {
        $data = BeratJenis::where('status',1)->get();

        if($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'sucess'    => false,
                'message'   => 'Data berat jenis tidak ditemukan',
                'data'      => [],
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil ditemukan',
            'data'      => $data
        ]);
    }

    public function storeBeratJenis(Request $request)
    {
        $request->validate([
            'beratjenis'    => 'required|integer',
        ]);

        $data = BeratJenis::create([
            'beratjenis'    => $request->beratjenis,
            'oleh'          => Auth::user()->id,
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil disimpan',
            'data'      => $data
        ]);
    }

    public function updateBeratJenis(Request $request)
    {
        $request->validate([
            'beratjenis' => 'required|integer',
        ]);

        $data = BeratJenis::find($request->id);

        if (!$data) {
            return response()->json([
                'status'    => 400,
                'success'   => false,
                'message'   => 'Data berat jenis tidak ditemukan',
            ]);
        }

        $data->update([
            'beratjenis' => $request->beratjenis
        ]);

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis Berhasil Diupdate',
            'Data'      => $data
        ]);
    }

    public function deleteBeratJenis(Request $request)
    {
        $data = BeratJenis::find($request->id);

        if (!$data) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data berat jenis tidak ditemukan.',
                'data' => null
            ], 404);
        }

        $data->update(['status' => '0']);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data berat jenis berhasil dihapus.',
            'data' => null
        ], 200);
    }
}
