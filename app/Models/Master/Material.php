<?php

namespace App\Models\Master;

use App\Models\User;
use App\Models\Master\Kategori;
use App\Models\Timbangan\StoneCrusher;
use Illuminate\Database\Eloquent\Model;
use App\Models\Timbangan\AsphaltMixingPlant;
use App\Models\Timbangan\ConcreteBatchingPlant;
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
        'satuan',
        'oleh',
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

    // Relasi ke Stone Crusher
    public function stoneCrushers()
    {
        return $this->hasMany(StoneCrusher::class, 'material_id');
    }

    // Relasi ke Concrete Batching Plant
    public function concretePlants()
    {
        return $this->hasMany(ConcreteBatchingPlant::class, 'material_id');
    }

    // Relasi ke Asphalt Mixing Plant
    public function asphaltPlants()
    {
        return $this->hasMany(AsphaltMixingPlant::class, 'material_id');
    }

    /**
     * Get the oleh that owns the Material
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
