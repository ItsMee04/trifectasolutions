<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;
    protected $table = 'kategori';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kategori',
        'status',
    ];

    // /**
    //  * Get all of the material for the Kategori
    //  *
    //  * @return \Illuminate\Database\Eloquent\Relations\HasMany
    //  */
    // public function material(): HasMany
    // {
    //     return $this->hasMany(Material::class, 'kategori_id', 'id');
    // }
}
