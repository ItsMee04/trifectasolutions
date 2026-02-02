<?php

namespace App\Models\Timbangan;

use App\Models\Master\Driver;
use App\Models\Master\Suplier;
use App\Models\Master\Material;
use App\Models\Master\Kendaraan;
use Illuminate\Database\Eloquent\Model;
use App\Models\KegiatanArmada\JarakHarga;
use App\Models\Master\BeratJenis;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AsphaltMixingPlant extends Model
{
    use HasFactory;
    protected $table = 'asphaltmixingplant';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'tanggal',
        'material_id',
        'kendaraan_id',
        'driver_id',
        'suplier_id',
        'beratjenis_id',
        'jenis',
        'volume',
        'berattotal',
        'beratkendaraan',
        'beratmuatan',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($aspahltmixingplant) {
            // Generate kode otomatis saat membuat data baru
            $aspahltmixingplant->kode = self::generateKodeAMP();
        });
    }

    public static function generateKodeAMP()
    {
        // Ambil kode stonecrusher terakhir
        $aspahltmixingplantID = self::orderBy('id', 'desc')->first();

        if (!$aspahltmixingplantID) {
            // Jika belum ada data, mulai dari 001
            $number = 1;
        } else {
            // Ambil angka dari kode driver terakhir
            $lastCode = $aspahltmixingplantID->kode;
            $lastNumber = (int) substr($lastCode, 4); // DRV-001 -> ambil 001
            $number = $lastNumber + 1;
        }

        // Format angka dengan leading zeros (3 digit)
        $formattedNumber = str_pad($number, 8, '0', STR_PAD_LEFT);

        return 'CBPID-' . $formattedNumber;
    }

    /**
     * Get the material that owns the StoneCrusher
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }

    /**
     * Get the kendaraan that owns the StoneCrusher
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id', 'id');
    }

    /**
     * Get the driver that owns the StoneCrusher
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'id');
    }

    /**
     * Get the suplier that owns the StoneCrusher
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function suplier(): BelongsTo
    {
        return $this->belongsTo(Suplier::class, 'suplier_id', 'id');
    }

    public function jarakHarga()
    {
        return $this->morphOne(JarakHarga::class, 'source');
    }

    /**
     * Get the beratjenis that owns the AsphaltMixingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function beratjenis(): BelongsTo
    {
        return $this->belongsTo(BeratJenis::class, 'beratjenis_id', 'id');
    }
}
