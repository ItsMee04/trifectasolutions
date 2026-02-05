<?php

namespace Database\Seeders;

use App\Models\Master\JenisKendaraan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenisKendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jeniskendaraan = [
            ['jenis' => 'DT',  'indexperkm' => '5'],
            ['jenis' => 'DTT', 'indexperkm' => '3'],
            ['jenis' => 'SL',  'indexperkm' => '2'],
        ];

        foreach ($jeniskendaraan as $data) {
            // Gunakan Eloquent (Driver::create) agar event 'creating' di Model terpanggil
            JenisKendaraan::create([
                'jenis'         => $data['jenis'],
                'indexperkm'    => $data['indexperkm'],
                'oleh'     => 1,
            ]);
        }
    }
}
