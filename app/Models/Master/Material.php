<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Material extends Model
{
    use HasFactory;
    protected $table = 'material';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'kategori_id',
        'material',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($material) {
            // Generate kode otomatis saat membuat data baru
            $material->kode = self::generateKodeMaterial();
        });
    }

    public static function generateKodeMaterial()
    {
        // Ambil kode material terakhir
        $lastMaterial = self::orderBy('id', 'desc')->first();

        if (!$lastMaterial) {
            // Jika belum ada data, mulai dari 001
            $number = 1;
        } else {
            // Ambil angka dari kode material terakhir
            $lastCode = $lastMaterial->kode;
            $lastNumber = (int) substr($lastCode, 4); // DRV-001 -> ambil 001
            $number = $lastNumber + 1;
        }

        // Format angka dengan leading zeros (3 digit)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'MTL-' . $formattedNumber;
    }

    /**
     * Get the kategori that owns the Material
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id', 'id');
    }
}
