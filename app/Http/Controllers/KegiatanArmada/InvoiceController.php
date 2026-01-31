<?php

namespace App\Http\Controllers\KegiatanArmada;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\KegiatanArmada\Invoice;
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
            'kategori'    => 'required',
            'periodeawal' => 'nullable|date', // Tambahkan validasi nullable
            'periodeakhir' => 'nullable|date',
        ]);

        $query = KegiatanArmada::with(['jarak.source.material.kategori', 'jarak.source.kendaraan', 'jarak.source.driver'])
            ->where('status', 1)
            // Pastikan hanya ambil data yang BELUM ada di tabel detail invoice
            ->whereDoesntHave('invoices');

        // FILTER TANGGAL: Hanya eksekusi jika kedua input tanggal ada isinya
        if ($request->filled('periodeawal') && $request->filled('periodeakhir')) {
            $query->whereBetween('tanggal', [$request->periodeawal, $request->periodeakhir]);
        }

        $query->whereHas('jarak', function ($query) use ($request) {
            $query->where('pengambilan', $request->pengambilan)
                ->where('tujuan', $request->tujuan)
                ->whereHasMorph('source', [
                    StoneCrusher::class,
                    ConcreteBatchingPlant::class,
                    AsphaltMixingPlant::class
                ], function ($qSource) use ($request) {
                    $qSource->whereHas('material', function ($qMaterial) use ($request) {
                        $qMaterial->whereHas('kategori', function ($qKategori) use ($request) {
                            $qKategori->where('kategori', $request->kategori);
                        });
                    });
                });
        });

        $data = $query->get();

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => $data->isEmpty() ? 'Data tidak ditemukan' : 'Data berhasil ditemukan',
            'data'      => $data
        ]);
    }

    public function storeInvoice(Request $request)
    {
        $request->validate([
            'nomorinvoice'   => 'required',
            'pengambilan'     => 'required',
            'tujuan'          => 'required',
            'kategori'        => 'required',
            'periodeawal'     => 'nullable|date',
            'periodeakhir'    => 'nullable|date',
            'kegiatan_ids'    => 'required|array|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Simpan Header Invoice
                $invoice = Invoice::create([
                    'nomorinvoice'   => $request->nomorinvoice,
                    'pengambilan'     => $request->pengambilan,
                    'tujuan'          => $request->tujuan,
                    'kategori'        => $request->kategori,
                    'periodeawal'    => $request->periodeawal,
                    'periodeakhir'   => $request->periodeakhir,
                ]);

                // 2. Simpan Detail (Mapping ID ke tabel pivot)
                $details = array_map(function ($kegiatanId) use ($invoice) {
                    return [
                        'invoice_id'         => $invoice->id,
                        'kegiatanarmada_id'  => $kegiatanId,
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ];
                }, $request->kegiatan_ids);

                DB::table('invoicedetail')->insert($details);

                return response()->json([
                    'status'  => 201,
                    'success' => true,
                    'message' => 'Invoice berhasil disimpan',
                    'data'    => $invoice
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
