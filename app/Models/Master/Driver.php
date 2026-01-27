<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;
    protected $table = 'driver';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'kode',
        'nama',
        'kontak',
        'alamat',
        'rekening',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($driver) {
            // Generate kode otomatis saat membuat data baru
            $driver->kode = self::generateKodeDriver();
        });
    }

    public static function generateKodeDriver()
    {
        // Ambil kode driver terakhir
        $lastDriver = self::orderBy('id', 'desc')->first();

        if (!$lastDriver) {
            // Jika belum ada data, mulai dari 001
            $number = 1;
        } else {
            // Ambil angka dari kode driver terakhir
            $lastCode = $lastDriver->kode;
            $lastNumber = (int) substr($lastCode, 4); // DRV-001 -> ambil 001
            $number = $lastNumber + 1;
        }

        // Format angka dengan leading zeros (3 digit)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'DRV-' . $formattedNumber;
    }
}
