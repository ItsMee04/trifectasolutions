<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['kategori' => 'ASPAL', 'oleh' => 1],
            ['kategori' => 'BATU BELAH', 'oleh' => 1],
            ['kategori' => 'BATU BLONOS', 'oleh' => 1],
            ['kategori' => 'BISKOS', 'oleh' => 1],
            ['kategori' => 'BOX INLET', 'oleh' => 1],
            ['kategori' => 'CMM', 'oleh' => 1],
            ['kategori' => 'CTB', 'oleh' => 1],
            ['kategori' => 'CULVERT', 'oleh' => 1],
            ['kategori' => 'GALIAN', 'oleh' => 1],
            ['kategori' => 'HARIAN', 'oleh' => 1],
            ['kategori' => 'HOTMIX', 'oleh' => 1],
            ['kategori' => 'KEGIATAN', 'oleh' => 1],
            ['kategori' => 'KROP', 'oleh' => 1],
            ['kategori' => 'LANGSIR', 'oleh' => 1],
            ['kategori' => 'LIMESTONE', 'oleh' => 1],
            ['kategori' => 'LPC', 'oleh' => 1],
            ['kategori' => 'MOBILISASI', 'oleh' => 1],
            ['kategori' => 'PASIR', 'oleh' => 1],
            ['kategori' => 'SIRTU', 'oleh' => 1],
            ['kategori' => 'SPLIT', 'oleh' => 1],
            ['kategori' => 'STANDBY', 'oleh' => 1],
            ['kategori' => 'STORING', 'oleh' => 1],
            ['kategori' => 'TANAH', 'oleh' => 1],
            ['kategori' => 'UDITCH', 'oleh' => 1],
        ];

        foreach ($data as $item) {
            DB::table('kategori')->insert([
                'kategori'          => $item['kategori'],
                'oleh'              => 1,
            ]);
        }
    }
}
