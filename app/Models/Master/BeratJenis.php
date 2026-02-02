<?php

namespace App\Models\Master;

use App\Models\Timbangan\AsphaltMixingPlant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BeratJenis extends Model
{
    use HasFactory;
    protected $table = 'beratjenis';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'beratjenis',
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
}
