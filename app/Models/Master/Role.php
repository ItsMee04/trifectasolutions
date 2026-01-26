<?php

namespace App\Models\Master;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;
    protected $table = 'role';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'role',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'id');
    }
}
