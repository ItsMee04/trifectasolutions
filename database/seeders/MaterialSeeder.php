<?php

namespace Database\Seeders;

use App\Models\Master\Material;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            // ASPAL (ID: 1)
            ['material' => 'ASPAL', 'kategori_id' => 1, 'satuan' => 'M3'],

            // BATU BELAH (ID: 2)
            ['material' => 'BATU BELAH', 'kategori_id' => 2, 'satuan' => 'M3'],

            // BATU BLONOS (ID: 3)
            ['material' => 'BATU BLONOS', 'kategori_id' => 3, 'satuan' => 'M3'],

            // BISKOS (ID: 4)
            ['material' => 'LPA', 'kategori_id' => 4, 'satuan' => 'M3'],
            ['material' => 'LPB', 'kategori_id' => 4, 'satuan' => 'M3'],
            ['material' => 'LPS', 'kategori_id' => 4, 'satuan' => 'M3'],
            ['material' => 'LD', 'kategori_id' => 4, 'satuan' => 'M3'],

            // BOX INLET (ID: 5)
            ['material' => 'BOX INLET', 'kategori_id' => 5, 'satuan' => 'PCS'],

            // CMM (ID: 6)
            ['material' => 'GALIAN CMM', 'kategori_id' => 6, 'satuan' => 'M3'],
            ['material' => 'CTB', 'kategori_id' => 6, 'satuan' => 'M3'],

            // CULVERT (ID: 7)
            ['material' => 'BOX CULVERT', 'kategori_id' => 7, 'satuan' => 'PCS'],

            // GALIAN (ID: 8)
            ['material' => 'GALIAN TANAH', 'kategori_id' => 8, 'satuan' => 'M3'],
            ['material' => 'GALIAN BLEKER', 'kategori_id' => 8, 'satuan' => 'M3'],
            ['material' => 'GALIAN BETON', 'kategori_id' => 8, 'satuan' => 'M3'],
            ['material' => 'GALIAN BREKER', 'kategori_id' => 8, 'satuan' => 'M3'],

            // HARIAN (ID: 9)
            ['material' => 'JEMPUT TENAGA+LANGSIR', 'kategori_id' => 9, 'satuan' => 'PCS'],

            // HOTMIX (ID: 10)
            ['material' => 'HRS', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BC', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WC', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BCL', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BASE', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WC ASB B50/30', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WC PRA CAMPUR', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BC MOD', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BASE MOD', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WC MOD', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.BCP', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'LATASIR A', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'HRS WCP', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WC P', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'HRS-WCP', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'SAND SHEET', 'kategori_id' => 10, 'satuan' => 'M3'],
            ['material' => 'AC.WCP', 'kategori_id' => 10, 'satuan' => 'M3'],

            // KEGIATAN (ID: 11)
            ['material' => 'KEGIATAN BATANG', 'kategori_id' => 11, 'satuan' => 'PCS'],
            ['material' => 'STANDBY BATANG', 'kategori_id' => 11, 'satuan' => 'PCS'],
            ['material' => 'KEGIATAN PETARUKAN', 'kategori_id' => 11, 'satuan' => 'PCS'],

            // KROP (ID: 12)
            ['material' => 'KROP', 'kategori_id' => 12, 'satuan' => 'M3'],

            // LANGSIR (ID: 13)
            ['material' => 'LANGSIR TANAH', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LANGSIR ONDOL', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LANGSIR BLONOS', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'POROS', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'PUING', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LANGSIR LPC', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LANGSIR MATERIAL', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LIMBAH', 'kategori_id' => 13, 'satuan' => 'M3'],
            ['material' => 'LANGSIR UDITCH', 'kategori_id' => 13, 'satuan' => 'M3'],

            // LIMESTONE (ID: 14)
            ['material' => 'LIMSTONE', 'kategori_id' => 14, 'satuan' => 'M3'],

            // LPC (ID: 15)
            ['material' => 'LPC', 'kategori_id' => 15, 'satuan' => 'M3'],

            // MOBILISASI (ID: 16) - Menggunakan PCS untuk setiap 1x mobilisasi
            ['material' => 'MOB VIBRO', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB LOADER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA PC200', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA PC75', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB BLEKER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA PC50', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TANDEM', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TANDEM DINAPACK', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB CMM', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR DINAPACK', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB VINISHER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR+EXA PC200', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR+VIBRO', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB VINISHER+TR', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB BABYROLER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA SK75', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB PTR04', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB PTR03', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR02', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TBR 01', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA SK75-12', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA PC75-14', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-17', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-02', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB BULDOZER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB VIBRO 02', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-09', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 75-12', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 75-14', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB ALAT', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB VINSHER DYNAPAC', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-11', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-08', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB FINISHER DYNAPA', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB FINISHER DYNAPACK', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-07', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB EXA75-14', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB BABY ROLLER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB FINISHER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB TR01', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB FINISHER SUMITOMO', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB DEMOB EXA 75-14', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA 200-06', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB EXA 200-11', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB DT', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'LANGSIR FINISHER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'MOB BARRIER', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB TBR 01', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB TR 01', 'kategori_id' => 16, 'satuan' => 'PCS'],
            ['material' => 'DEMOB TR 02', 'kategori_id' => 16, 'satuan' => 'PCS'],

            // PASIR (ID: 17)
            ['material' => 'PASIR', 'kategori_id' => 17, 'satuan' => 'M3'],

            // SIRTU (ID: 18)
            ['material' => 'SIRTU', 'kategori_id' => 18, 'satuan' => 'M3'],

            // SPLIT (ID: 19)
            ['material' => 'ABU BATU', 'kategori_id' => 19, 'satuan' => 'M3'],
            ['material' => 'SPLIT 0/5', 'kategori_id' => 19, 'satuan' => 'M3'],
            ['material' => 'SPLIT 1/1', 'kategori_id' => 19, 'satuan' => 'M3'],
            ['material' => 'SPLIT 1/2', 'kategori_id' => 19, 'satuan' => 'M3'],
            ['material' => 'SPLIT 2/3', 'kategori_id' => 19, 'satuan' => 'M3'],

            // STANDBY (ID: 20)
            ['material' => 'STANDBY MATERIAL', 'kategori_id' => 20, 'satuan' => 'PCS'],
            ['material' => 'STANDBY PASIR', 'kategori_id' => 20, 'satuan' => 'PCS'],

            // STORING (ID: 21)
            ['material' => 'STORING ALAT', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING BESI', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING GENSET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING RIJIT+BESI', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING UDITCH KENET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING RIJIT+BESI KENET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'MOB TENAGA SANTO', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING BESI KENET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'MOB LOADER KENET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'MOB EXA PC200 KENET', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'ANTAR BEGISTING', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'AMBIL ALAT', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'JEMPUT TENAGA', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING KOMPRESOR', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING PLASTIK', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING PATOK', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING BANNER', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING PAPAN COR', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING CORONG COR', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'MOB TOREN DLL', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING BARIER', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING SEMBAKO', 'kategori_id' => 21, 'satuan' => 'PCS'],
            ['material' => 'STORING KAYU', 'kategori_id' => 21, 'satuan' => 'PCS'],

            // TANAH (ID: 22)
            ['material' => 'TANAH URUG', 'kategori_id' => 22, 'satuan' => 'M3'],

            // UDITCH (ID: 23)
            ['material' => 'STORING UDITCH', 'kategori_id' => 23, 'satuan' => 'PCS'],
            ['material' => 'TUTUP UDITCH', 'kategori_id' => 23, 'satuan' => 'PCS'],
            ['material' => 'UDITCH', 'kategori_id' => 23, 'satuan' => 'PCS'],
            ['material' => 'UDITCH KECIL', 'kategori_id' => 23, 'satuan' => 'PCS'],
            ['material' => 'STORING TUTUP UDITCH', 'kategori_id' => 23, 'satuan' => 'PCS'],
        ];

        foreach ($materials as $item) {
            Material::create([
                'material'      => $item['material'],
                'kategori_id'   => $item['kategori_id'],
                'satuan'        => $item['satuan'],
                'oleh'          => 1,
                'status'        => 1,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }
    }
}
