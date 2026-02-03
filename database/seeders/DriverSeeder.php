<?php

namespace Database\Seeders;

use App\Models\Master\Driver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drivers = [
            ['nama' => 'RINO RUSYANTO', 'rekening' => '1864908647'],
            ['nama' => 'WARSIKUN MUHARTONO', 'rekening' => '1864908625'],
            ['nama' => 'SIGIT SULISTIO MANDALA PUTRA', 'rekening' => '1864908603'],
            ['nama' => 'KUSDIANTO', 'rekening' => '1864908580'],
            ['nama' => 'SUDIRIN', 'rekening' => '1864908557'],
            ['nama' => 'KUNTONO', 'rekening' => '1864908535'],
            ['nama' => 'SALIKUN', 'rekening' => '1864908513'],
            ['nama' => 'AGUS WINARSO', 'rekening' => '1864908488'],
            ['nama' => 'KARTISUN HERMADI', 'rekening' => '1864908455'],
            ['nama' => 'LUDIANTO', 'rekening' => '1864908433'],
            ['nama' => 'NARSONO', 'rekening' => '1864908411'],
            ['nama' => 'NARTUM', 'rekening' => '1864908397'],
            ['nama' => 'SURATNO', 'rekening' => '1864908375'],
            ['nama' => 'SUYATNO', 'rekening' => '1864908353'],
            ['nama' => 'TOFAN SUHERMI', 'rekening' => '1864908331'],
            ['nama' => 'SARTAM', 'rekening' => '1864908308'],
            ['nama' => 'YANUAR EKA SUDIANTORO', 'rekening' => '1864908284'],
            ['nama' => 'DWI KURNIAWAN', 'rekening' => '1864908262'],
            ['nama' => 'FAJAR SETIAJI', 'rekening' => '1864908251'],
            ['nama' => 'IKHTIAR SETIO SUGIARTO', 'rekening' => '1864908738'],
            ['nama' => 'MARSIYANTO', 'rekening' => '1864908772'],
            ['nama' => 'BENI BUDIMAN', 'rekening' => '1864908794'],
            ['nama' => 'KHAMDI ABILUN', 'rekening' => '1864908818'],
            ['nama' => 'SAMINGUN', 'rekening' => '1864908716'],
            ['nama' => 'RISMANTO', 'rekening' => '1864908669'],
            ['nama' => 'ERIS SUTRIYONO', 'rekening' => '1864908692'],
            ['nama' => 'RUHAND FAWAID', 'rekening' => '1864908750'],
            ['nama' => 'AGUS TUSILO', 'rekening' => '1864908807'],
        ];

        foreach ($drivers as $data) {
            // Gunakan Eloquent (Driver::create) agar event 'creating' di Model terpanggil
            Driver::create([
                'nama'     => $data['nama'],
                'rekening' => $data['rekening'],
                'kontak'   => '-',
                'alamat'   => '-',
                'status'   => 1,
            ]);
        }
    }
}
