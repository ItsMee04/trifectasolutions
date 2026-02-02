<?php

namespace App\Models\Master;

use App\Models\Master\Material;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kendaraan extends Model
{
    use HasFactory;
    protected $table = 'kendaraan';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'kendaraan',
        'jeniskendaraan_id',
        'nomor',
        'status',
    ];

    /**
     * Get all of the material for the Kategori
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function material(): HasMany
    {
        return $this->hasMany(Material::class, 'kategori_id', 'id');
    }

    /**
     * Get the bahanbakar that owns the Kendaraan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jeniskendaraan(): BelongsTo
    {
        return $this->belongsTo(JenisKendaraan::class, 'jeniskendaraan_id', 'id');
    }
}
