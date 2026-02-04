<?php

namespace App\Models\Master;

use App\Models\User;
use App\Models\Master\Material;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kategori extends Model
{
    use HasFactory;
    protected $table = 'kategori';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kategori',
        'oleh',
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
     * Get the oleh that owns the Kategori
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
