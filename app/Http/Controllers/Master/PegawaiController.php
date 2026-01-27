<?php

namespace App\Http\Controllers\Master;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Master\Pegawai;
use App\Http\Controllers\Controller;

class PegawaiController extends Controller
{
    public function getPegawai()
    {
        $data  = Pegawai::where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data Pegawai Tidak Ditemukan',
                'data'      => []
            ]);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data Pegawai Ditemukan',
            'data' => $data
        ], 200);
    }

    public function storePegawai(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'nama'   => 'required|string|max:100',
            'kontak' => 'required|string|max:100',
            'alamat' => 'required|string',
            'image'  => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Proses File Image
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '.' . $file->extension();

            // Memastikan folder tujuan ada
            $destinationPath = public_path('/storage/pegawai/image');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $imageName);
        }

        // 3. Simpan ke Database
        $pegawai = Pegawai::create([
            'nama'   => strtoupper($request->nama),
            'kontak' => $request->kontak,
            'alamat' => strtoupper($request->alamat),
            'image'  => $imageName,
            'status' => 1,
        ]);

        if($pegawai) {
            // Logika tambahan jika diperlukan
            User::create([
                'pegawai_id' => $pegawai->id,
                'status'     => 2,
            ]);
        }

        // 4. Response JSON (Status 201 untuk Created)
        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Pegawai Berhasil Ditambahkan',
            'data'      => $pegawai
        ], 201);
    }

    public function updatePegawai(Request $request)
    {
        // 1. Validasi - Gunakan nama field yang sesuai (imagePegawai)
        $request->validate([
            'nama'   => 'required|string|max:100',
            'kontak' => 'required|string|max:100',
            'alamat' => 'required|string',
            'image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Sesuaikan nama
        ]);

        $pegawai = Pegawai::find($request->id);
        if (!$pegawai) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Pegawai Tidak Ditemukan'
            ], 404);
        }

        // 2. Proses File Image jika ada
        if ($request->hasFile('image')) { // Sesuaikan nama field
            // Hapus foto lama agar tidak memenuhi server
            if ($pegawai->image) {
                $oldPath = storage_path('app/public/pegawai/image/' . $pegawai->image);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $file = $request->file('image');
            $imageName = time() . '.' . $file->extension();

            // Gunakan storeAs untuk konsistensi dengan storage:link
            $file->storeAs('pegawai/image', $imageName, 'public');

            // Simpan nama file baru ke database
            $pegawai->image = $imageName;
        }

        // 3. Update Data Text
        $pegawai->nama   = strtoupper($request->nama);
        $pegawai->kontak = $request->kontak;
        $pegawai->alamat = strtoupper($request->alamat);
        $pegawai->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Pegawai Berhasil Diupdate',
            'data'      => $pegawai
        ], 200);
    }

    public function deletePegawai(Request $request)
    {
        $pegawai = Pegawai::find($request->id);
        if (!$pegawai) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data Pegawai Tidak Ditemukan'
            ], 404);
        }

        // Soft delete dengan mengubah status
        $pegawai->status = 0;
        $pegawai->save();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data Pegawai Berhasil Dihapus'
        ], 200);
    }
}
