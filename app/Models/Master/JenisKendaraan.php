<?php

namespace App\Models\Master;

use App\Models\User;
use App\Models\Master\Kendaraan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JenisKendaraan extends Model
{
    use HasFactory;
    protected $table = 'jeniskendaraan';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'jenis',
        'indexperkm',
        'oleh',
        'status',
    ];

    /**
     * Get all of the kendaraan for the BahanBakar
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function kendaraan(): HasMany
    {
        return $this->hasMany(Kendaraan::class, 'jeniskendaraan_id', 'id');
    }

    /**
     * Get the oleh that owns the JenisKendaraan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
