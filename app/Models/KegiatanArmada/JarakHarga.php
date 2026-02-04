<?php

namespace App\Models\KegiatanArmada;

use App\Models\User;
use App\Models\Master\Material;
use Illuminate\Database\Eloquent\Model;
use App\Models\KegiatanArmada\KegiatanArmada;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JarakHarga extends Model
{
    use HasFactory;
    protected $table = 'jarakdanharga';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'tanggal',
        'kode',
        'pengambilan',
        'tujuan',
        'jarak',
        'hargaupah',
        'hargajasa',
        'oleh',
        'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($jarakDanHarga) {
            // Generate kode otomatis saat membuat data baru
            $jarakDanHarga->kode = self::generateKodeJarak();
        });
    }

    public static function generateKodeJarak()
    {
        // Ambil kode jarak terakhir
        $lastJarak = self::orderBy('id', 'desc')->first();

        if (!$lastJarak) {
            // Jika belum ada data, mulai dari 001
            $number = 1;
        } else {
            // Ambil angka dari kode jarak terakhir
            $lastCode = $lastJarak->kode;
            $lastNumber = (int) substr($lastCode, 4); // DRV-001 -> ambil 001
            $number = $lastNumber + 1;
        }

        // Format angka dengan leading zeros (3 digit)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'JRK-' . $formattedNumber;
    }

    public function kegiatanArmada()
    {
        return $this->hasOne(KegiatanArmada::class, 'jarak_id');
    }

    /**
     * Get the user that owns the JarakDanHarga
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }

    public function source()
    {
        return $this->morphTo();
    }

    /**
     * Get the oleh that owns the JarakHarga
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
