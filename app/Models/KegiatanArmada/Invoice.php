<?php

namespace App\Models\KegiatanArmada;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $table = 'invoice';
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

    public function kegiatanArmada()
    {
        return $this->belongsToMany(
            KegiatanArmada::class,
            'invoicedetail',
            'invoice_id',
            'kegiatanarmada_id'
        );
    }
}
