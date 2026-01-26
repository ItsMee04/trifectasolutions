<?php

namespace App\Models\Master;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pegawai extends Model
{
    use HasFactory;
    protected $table = 'pegawai';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'nama',
        'kontak',
        'alamat',
        'image',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'pegawai_id', 'id');
    }
}
