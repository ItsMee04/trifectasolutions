<?php

namespace App\Http\Controllers\Master;

use App\Models\Master\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleController extends Controller
{
    public function getRole()
    {
        $data = Role::where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeRole(Request $request)
    {
        $request->validate([
            'role' => 'required|max:255',
        ]);

        $role = new Role();
        $role->role = strtoupper($request->input('role'));
        $role->save();

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data role berhasil disimpan',
            'data'      => $role
        ], 201);
    }

    public function updateRole(Request $request)
    {
        $request->validate([
            'role' => 'required|max:255',
        ]);

        $role = Role::find($request->id);

        if (!$role) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
                'data'      => null
            ]);
        }

        $role->role = strtoupper($request->input('role'));
        $role->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil diupdate',
            'data'      => $role
        ], 200);
    }

    public function deleteRole(Request $request)
    {
        $role = Role::find($request->id);

        if (!$role) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
                'data'      => null
            ]);
        }

        $role->status = 0; // Soft delete by setting status to 0
        $role->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil dihapus',
        ], 200);
    }
}
