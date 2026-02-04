<?php

namespace App\Models\Master;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use App\Models\Timbangan\AsphaltMixingPlant;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BeratJenis extends Model
{
    use HasFactory;
    protected $table = 'beratjenis';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'beratjenis',
        'oleh',
        'status',
    ];

    /**
     * Get all of the amp for the BeratJenis
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function amp(): HasMany
    {
        return $this->hasMany(AsphaltMixingPlant::class, 'beratjenis_id', 'id');
    }

    /**
     * Get the oleh that owns the BeratJenis
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
