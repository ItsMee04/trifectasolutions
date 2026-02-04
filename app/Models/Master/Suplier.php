<?php

namespace App\Models\Master;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Suplier extends Model
{
    use HasFactory;
    protected $table = 'suplier';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'nama',
        'kontak',
        'alamat',
        'oleh',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($suplier) {
            // Generate kode otomatis saat membuat data baru
            $suplier->kode = self::generateKodeSuplier();
        });
    }

    public static function generateKodeSuplier()
    {
        // Ambil kode suplier terakhir
        $lastSuplier = self::orderBy('id', 'desc')->first();

        if (!$lastSuplier) {
            // Jika belum ada data, mulai dari 001
            $number = 1;
        } else {
            // Ambil angka dari kode suplier terakhir
            $lastCode = $lastSuplier->kode;
            $lastNumber = (int) substr($lastCode, 4); // SUP-001 -> ambil 001
            $number = $lastNumber + 1;
        }

        // Format angka dengan leading zeros (3 digit)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'SUP-' . $formattedNumber;
    }

    /**
     * Get the oleh that owns the Suplier
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
