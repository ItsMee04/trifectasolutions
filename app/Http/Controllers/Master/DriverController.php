<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Driver;
use App\Http\Controllers\Controller;

class DriverController extends Controller
{
    public function getDriver()
    {
        $data = Driver::where('status', '1')->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'No active drivers found.',
                'data'      => []
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Active drivers retrieved successfully.',
            'data' => $data
        ], 200);
    }

    public function storeDriver(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'required|string|max:255',
            'alamat'    => 'required|string|max:500',
            'rekening'  => 'nullable|string|max:255',
        ]);

        $driver = Driver::create([
            'nama' => strtoupper($request->nama),
            'kontak' => strtoupper($request->kontak),
            'alamat' => strtoupper($request->alamat),
            'rekening' => strtoupper($request->rekening),
        ]);

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Driver created successfully.',
            'data' => $driver
        ], 201);
    }

    public function updateDriver(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'required|string|max:255',
            'alamat'    => 'required|string|max:500',
            'rekening'  => 'nullable|string|max:255',
        ]);

        $driver = Driver::find($request->id);

        if (!$driver) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Driver not found.',
                'data' => null
            ], 404);
        }

        $driver->update([
            'nama' => strtoupper($request->nama),
            'kontak' => strtoupper($request->kontak),
            'alamat' => strtoupper($request->alamat),
            'rekening' => strtoupper($request->rekening),
        ]);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Driver updated successfully.',
            'data' => $driver
        ], 200);
    }

    public function deleteDriver(Request $request)
    {
        $driver = Driver::find($request->id);

        if (!$driver) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Driver not found.',
                'data' => null
            ], 404);
        }

        $driver->update(['status' => '0']);

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Driver deleted successfully.',
            'data' => null
        ], 200);
    }
}
