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
                'message'   => 'No active roles found',
                'data'      => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Active roles retrieved successfully',
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
            'message'   => 'Role created successfully',
            'data'      => $role
        ], 201);
    }

    public function editRole($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Role not found',
                'data'      => null
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Role retrieved successfully',
            'data'      => $role
        ], 200);
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
                'message'   => 'Role not found',
                'data'      => null
            ]);
        }

        $role->role = strtoupper($request->input('role'));
        $role->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Role updated successfully',
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
                'message'   => 'Role not found',
                'data'      => null
            ]);
        }

        $role->status = 0; // Soft delete by setting status to 0
        $role->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Role deleted successfully',
        ], 200);
    }
}
