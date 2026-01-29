<?php

namespace App\Http\Controllers\KegiatanArmada;

use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\KegiatanArmada;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function getInvoice(Request $request)
    {
        $request->validate([
            'pengambilan' => 'required',
            'tujuan'      => 'required',
            'kategori'    => 'required'
        ]);

        $data = KegiatanArmada::with(['jarak.material.kategori', 'kendaraan', 'driver'])
            ->where('status', 1)
            // 1. Filter Pengambilan & Tujuan di tabel Jarak
            ->whereHas('jarak', function ($query) use ($request) {
                $query->where('pengambilan', $request->pengambilan)
                    ->where('tujuan', $request->tujuan)
                    // 2. Masuk lebih dalam ke relasi Material
                    ->whereHas('material', function ($qMaterial) use ($request) {
                        // 3. Masuk lebih dalam lagi ke relasi Kategori
                        $qMaterial->whereHas('kategori', function ($qKategori) use ($request) {
                            // Filter berdasarkan nama kategori atau ID
                            // Sesuaikan 'kategori' di bawah ini dengan nama kolom di tabel kategori Anda
                            $qKategori->where('kategori', $request->kategori);
                        });
                    });
            })
            ->get();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => $data->isEmpty() ? 'Data tidak ditemukan' : 'Data berhasil ditemukan',
            'data'      => $data
        ]);
    }
}
