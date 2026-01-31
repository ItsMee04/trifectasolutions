<?php

namespace App\Models\KegiatanArmada;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;
    protected $table = 'invoicedetail';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'nomorinvoice',
        'pengambilan',
        'kategori',
        'tujuan',
        'periodeawal',
        'periodeakhir',
        'status'
    ];
}
