<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class KendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['kode' => 'SL001', 'kendaraan' => 'SELF LOADER', 'jeniskendaraan_id' => 3, 'nomor' => 'B 9072 UIQ'],
            ['kode' => 'SL002', 'kendaraan' => 'SELF LOADER', 'jeniskendaraan_id' => 3, 'nomor' => 'SL002'],
            ['kode' => 'SL003', 'kendaraan' => 'SELF LOADER', 'jeniskendaraan_id' => 3, 'nomor' => 'SL003'],
            ['kode' => 'DTT001', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 1799 GS'],
            ['kode' => 'DTT002', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 1798 GS'],
            ['kode' => 'DTT003', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 1527 WA'],
            ['kode' => 'DTT004', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 1981 QD'],
            ['kode' => 'DTT005', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 9272 QD'],
            ['kode' => 'DTT006', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'R 1983 CC'],
            ['kode' => 'DTT007', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'D 9659 UB'],
            ['kode' => 'DTT008', 'kendaraan' => 'DUMP TRUCK TRONTON', 'jeniskendaraan_id' => 2, 'nomor' => 'DTT008'],
            ['kode' => 'DT008', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1405 WA'],
            ['kode' => 'DT009', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1406 WA'],
            ['kode' => 'DT010', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1407 WA'],
            ['kode' => 'DT011', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1408 WA'],
            ['kode' => 'DT012', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1409 WA'],
            ['kode' => 'DT013', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8010 OA'],
            ['kode' => 'DT014', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8011 OA'],
            ['kode' => 'DT015', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8007 OA'],
            ['kode' => 'DT016', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8009 OA'],
            ['kode' => 'DT017', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8004 OA'],
            ['kode' => 'DT018', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8006 OA'],
            ['kode' => 'DT019', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 8003 OA'],
            ['kode' => 'DT020', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'A 8826 ZS'],
            ['kode' => 'DT021', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'R 1531 NA'],
            ['kode' => 'DT022', 'kendaraan' => 'DUMP TRUCK', 'jeniskendaraan_id' => 1, 'nomor' => 'G 9338 AM'],
        ];

        foreach ($data as $item) {
            DB::table('kendaraan')->insert([
                'kode'              => $item['kode'],
                'kendaraan'         => $item['kendaraan'],
                'jeniskendaraan_id' => $item['jeniskendaraan_id'],
                'nomor'             => $item['nomor'],
                'oleh'              => 1,
                'status'            => 1,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }
}
