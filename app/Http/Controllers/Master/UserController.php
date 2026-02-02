<?php

namespace App\Http\Controllers\Master;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getUsers()
    {
        $data = User::with(['role', 'pegawai'])->whereIn('status', [1, 2])->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data user tidak ditemukan',
                'data' => []
            ]);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data user berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function updateUsers(Request $request)
    {
        $messages = [
            'required' => ':attribute wajib diisi !!!',
            'unique'   => ':attribute sudah digunakan',
            'min'      => ':attribute minimal :min karakter'
        ];

        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        $rules = [];
        // Jika email diubah, validasi unik kecuali ID sendiri
        if ($request->has('email') && $request->email !== $user->email) {
            $rules['email'] = 'required|email|unique:users,email,' . $user->id;
        }

        // Jika password diisi
        if (!empty($request->password)) {
            if (Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password baru tidak boleh sama dengan password lama.'
                ], 422); // Gunakan 422 agar ditangkap errors.value di Vue
            }
            $rules['password'] = 'min:6';
        }

        // Jalankan validasi
        $request->validate($rules, $messages);

        // Update data
        $user->email = $request->email ?? $user->email;
        if (!empty($request->password)) {
            $user->password = Hash::make($request->password);
        }
        $user->role_id = $request->role_id ?? $user->role_id;
        $user->status = 1;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Data user berhasil diupdate"
        ], 200);
    }
}
