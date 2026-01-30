<?php

namespace App\Http\Controllers\KegiatanArmada;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Timbangan\StoneCrusher;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\KegiatanArmada\KegiatanArmada;
use App\Models\Timbangan\ConcreteBatchingPlant;

class InvoiceController extends Controller
{
    public function getInvoice(Request $request)
    {
        $request->validate([
            'pengambilan' => 'required',
            'tujuan'      => 'required',
            'kategori'    => 'required'
        ]);

        $data = KegiatanArmada::with(['jarak.source.material.kategori', 'jarak.source.kendaraan', 'jarak.source.driver'])
            ->where('status', 1)
            ->whereHas('jarak', function ($query) use ($request) {
                // 1. Filter Pengambilan & Tujuan di tabel Jarak
                $query->where('pengambilan', $request->pengambilan)
                    ->where('tujuan', $request->tujuan)

                    // 2. Masuk ke relasi Polymorphic 'source'
                    ->whereHasMorph('source', [
                        StoneCrusher::class,
                        ConcreteBatchingPlant::class,
                        AsphaltMixingPlant::class
                    ], function ($qSource) use ($request) {

                        // 3. Masuk ke relasi Material yang ada di dalam Source
                        $qSource->whereHas('material', function ($qMaterial) use ($request) {

                            // 4. Masuk ke relasi Kategori
                            $qMaterial->whereHas('kategori', function ($qKategori) use ($request) {
                                $qKategori->where('kategori', $request->kategori);
                            });
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
