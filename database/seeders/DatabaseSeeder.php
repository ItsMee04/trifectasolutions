<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Master\Role;
use App\Models\Master\Pegawai;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $data = [
            'ADMIN',
            'PEGAWAI'
        ];

        foreach ($data as $value) {
            Role::create([
                'role'      => $value,
                'status'    => 1
            ]);
        }

        Pegawai::create([
            'nama'          =>  'ADMIN TRIFECTA',
            'kontak'        =>  '081390469322',
            'alamat'        =>  'PURWOKERTO',
            'status'        =>  1,
        ]);

        User::create([
            'pegawai_id'    =>  1,
            'email'         =>  'admin@admin.com',
            'password'      =>  Hash::make('123'),
            'role_id'       =>  1,
            'status'        =>  1,
        ]);

        $this->call([
            DriverSeeder::class,
            JenisKendaraanSeeder::class,
            KendaraanSeeder::class,
            KategoriSeeder::class,
            MaterialSeeder::class,
            BeratJenisSeeder::class,
        ]);
    }
}
