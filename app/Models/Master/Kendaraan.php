<?php

namespace App\Models\Master;

use App\Models\Master\Material;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kendaraan extends Model
{
    use HasFactory;
    protected $table = 'kendaraan';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'kendaraan',
        'jenis',
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
}
