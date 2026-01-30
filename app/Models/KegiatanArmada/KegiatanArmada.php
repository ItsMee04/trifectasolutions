<?php

namespace App\Models\KegiatanArmada;

use App\Models\Master\Driver;
use App\Models\Master\Kendaraan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KegiatanArmada extends Model
{
    use HasFactory;
    protected $table = 'kegiatanarmada';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'tanggal',
        'jarak_id',
        'rit',
        'satuan',
        'upahhariankenet',
        'umluarkotatelahterbayar',
        'umpengajuan',
        'insentifataulembur',
        'upah',
        'jumlah',
        'penjualan',
        'status'
    ];

    /**
     * Get the jarak that owns the KegiatanArmada
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jarak(): BelongsTo
    {
        return $this->belongsTo(JarakHarga::class, 'jarak_id', 'id');
    }

    /**
     * Get the kendaran that owns the KegiatanArmada
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id', 'id');
    }

    /**
     * Get the driver that owns the KegiatanArmada
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'id');
    }
}
