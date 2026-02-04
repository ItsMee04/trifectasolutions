import { ref, computed, reactive, watch } from 'vue';
import { asphaltmixingplantService } from '../services/ampService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { suplierService } from '../../suplier/services/suplierService'
import { beratjenisService } from '../../beratjenis/services/beratjenisService'
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const AsphaltMixingPlants = ref([]);
const materialList = ref([]);
const kendaraanList = ref([]);
const driverList = ref([]);
const suplierList = ref([]);
const beratjenisList = ref([]);
const currentTab = ref('IN');
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});
const materialDataRaw = ref([]);
const columnFilters = reactive({
    material: '',
    tanggal: '',
    kode: '',
    kendaraan: '',
    driver: '',
    suplier: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: ''
});

const formAMP = reactive({
    id: null,
    kode: '',
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    suplier_id: null,
    beratjenis_id: null,
    jenis: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: '',
    jarakawal: '',
    jarakakhir: '',
    jarak: '',
});

const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

export function useAMP() {

    const switchTab = async (tab) => {
        currentTab.value = tab;
        currentPage.value = 1;
        await fetchAMP(tab);
    };

    const fetchAMP = async (jenisValue = null) => {
        isLoading.value = true;
        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = { jenis: targetJenis };
            const response = await asphaltmixingplantService.getAsphaltMixingPlant(payload);
            AsphaltMixingPlants.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Asphalt Mixing Plant:", error);
            AsphaltMixingPlants.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchMaterial = async () => {
        try {
            const response = await materialService.getMaterial();
            materialDataRaw.value = response.data; // Simpan data asli untuk cek satuan nanti
            materialList.value = response.data.map(item => ({
                value: item.id,
                label: item.material
            }));
        } catch (error) {
            console.log("Gagal memuat material:", error);
        }
    };

    // Helper untuk mendapatkan satuan material yang sedang dipilih
    const selectedMaterialSatuan = computed(() => {
        const material = materialDataRaw.value.find(m => m.id === formAMP.material_id);
        return material ? material.satuan.toLowerCase() : '';
    });

    // Logika Perhitungan Volume Otomatis
    watch(
        () => [formAMP.beratmuatan, formAMP.beratjenis_id, formAMP.material_id],
        () => {
            const beratMuatan = parseFloat(formAMP.beratmuatan) || 0;
            const satuan = selectedMaterialSatuan.value;

            // Cari nilai nominal berat jenis dari list berdasarkan ID yang dipilih
            const bjTerpilih = beratjenisList.value.find(b => b.value === formAMP.beratjenis_id);
            const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

            if (satuan === 'm3') {
                formAMP.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
            } else if (satuan === 'kg') {
                formAMP.volume = beratMuatan;
            } else if (satuan === 'liter' || satuan === 'pcs') {
                // Biarkan user input manual, jangan override jika sudah ada isinya
                // kecuali jika baru pindah ke satuan ini
            } else {
                formAMP.volume = 0;
            }
        }
    );

    const fetchKendaraan = async () => {
        try {
            const response = await kendaraanService.getKendaraan();
            kendaraanList.value = response.data.map(item => ({
                value: item.id,
                label: item.kode
            }))
        } catch (error) {
            console.log("Gagal memuat kendaraan:", error)
        }
    }

    const fetchDriver = async () => {
        try {
            const response = await driverService.getDrivers();
            driverList.value = response.data.map(item => ({
                value: item.id,
                label: item.nama
            }))
        } catch (error) {
            console.log("Gagal memuat driver:", error)
        }
    }

    const fetchSuplier = async () => {
        try {
            const response = await suplierService.getSuplier();
            suplierList.value = response.data.map(item => ({
                value: item.id,
                label: item.nama
            }));
        } catch (error) {
            console.error("Gagal memuat suplier:", error);
        }
    };

    const fetchBeratJenis = async () => {
        try {
            const response = await beratjenisService.getBeratJenis();
            beratjenisList.value = response.data.map(item => ({
                value: item.id,
                label: item.beratjenis
            }));
        } catch (error) {
            console.error("Gagal memuat berat jenis:", error);
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (!formAMP.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formAMP.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formAMP.volume === null || formAMP.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }

        if (formAMP.berattotal === null || formAMP.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }

        if (formAMP.beratkendaraan === null || formAMP.beratkendaraan === '') {
            errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitAMP = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formAMP.id,
                tanggal: formAMP.tanggal,
                material: formAMP.material_id,
                kendaraan: formAMP.kendaraan_id,
                driver: formAMP.driver_id,
                suplier: formAMP.suplier_id,
                beratjenis: formAMP.beratjenis_id,
                jenis: formAMP.jenis,
                volume: formAMP.volume,
                berattotal: formAMP.berattotal,
                beratkendaraan: formAMP.beratkendaraan,
                beratmuatan: formAMP.beratmuatan,
                jarakawal: formAMP.jarakawal,
                jarakakhir: formAMP.jarakakhir,
                jarak: formAMP.jarak,
            };

            let response;
            if (isEdit.value) {
                response = await asphaltmixingplantService.updateAsphaltMixingPlant(payload);
            } else {
                response = await asphaltmixingplantService.storeAsphaltMixingPlant(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalAMP');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchAMP();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                notify.error(error.response.data.message || 'Terjadi kesalahan validasi.');
            } else {
                notify.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        errors.value = {};
        formAMP.id = null;
        formAMP.tanggal = getTodayDate();
        formAMP.material_id = null;
        formAMP.kendaraan_id = null;
        formAMP.driver_id = null;
        formAMP.suplier_id = null;
        formAMP.beratjenis_id = null;
        formAMP.jenis = currentTab.value;
        formAMP.volume = '';
        formAMP.berattotal = '';
        formAMP.beratkendaraan = '';
        formAMP.beratmuatan = '';
        formAMP.jarakawal = '';
        formAMP.jarakakhir = '';
        formAMP.jarak = '';

        const modal = new bootstrap.Modal(document.getElementById('modalAMP'));
        modal.show();
    };

    watch(
        () => [formAMP.berattotal, formAMP.beratkendaraan],
        ([total, kendaraan]) => {
            const t = parseFloat(total) || 0;
            const k = parseFloat(kendaraan) || 0;
            const hasil = t - k;

            // Set hasil ke beratmuatan (jika hasil negatif set ke 0 atau biarkan saja)
            formAMP.beratmuatan = hasil > 0 ? hasil : 0;
        }
    );

    // Tambahkan WATCH baru untuk perhitungan jarak otomatis
    watch(
        () => [formAMP.jarakawal, formAMP.jarakakhir],
        ([awal, akhir]) => {
            const valAwal = parseFloat(awal) || 0;
            const valAkhir = parseFloat(akhir) || 0;
            const hasil = valAkhir - valAwal;

            if (hasil > 0) {
                // Gunakan .toFixed(2) untuk mendapatkan 2 angka di belakang koma
                // Kemudian bungkus dengan Number() agar tipenya kembali menjadi angka, bukan string
                formAMP.jarak = Number(hasil.toFixed(2));
            } else {
                formAMP.jarak = 0;
            }
        }
    );

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formAMP.id = item.id;
        formAMP.tanggal = item.tanggal;
        formAMP.material_id = item.material_id;
        formAMP.kendaraan_id = item.kendaraan_id;
        formAMP.driver_id = item.driver_id;
        formAMP.suplier_id = item.suplier_id;
        formAMP.beratjenis_id = item.beratjenis_id;
        formAMP.jenis = item.jenis;
        formAMP.volume = item.volume;
        formAMP.berattotal = item.berattotal;
        formAMP.beratkendaraan = item.beratkendaraan;
        formAMP.beratmuatan = item.beratmuatan;
        formAMP.jarakawal = item.jarakawal;
        formAMP.jarakakhir = item.jarakakhir;
        formAMP.jarak = item.jarak;

        const modal = new bootstrap.Modal(document.getElementById('modalAMP'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Asphalt Mixing Plant "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            isLoading.value = true;
            try {
                const payload = { id: item.id };
                await asphaltmixingplantService.deleteAsphaltMixingPlant(payload);
                notify.success('Asphalt Mixing Plant berhasil dihapus.');
                await fetchAMP();
            } catch (error) {
                notify.error('Gagal menghapus data Asphalt Mixing Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchAMP();
    }

    const formatNumber = (value, decimals = 0) => {
        if (value === null || value === undefined || value === '') return "0";
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };

    // --- HELPER UNTUK SEARCH MATCH ---
    const searchMatch = (item, query) => {
        return (
            String(item.kode || '').toLowerCase().includes(query) ||
            String(item.material?.material || '').toLowerCase().includes(query) ||
            String(item.kendaraan?.nomor || '').toLowerCase().includes(query) ||
            String(item.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.suplier?.nama || '').toLowerCase().includes(query) ||
            String(item.volume || '').toLowerCase().includes(query) ||
            String(item.berattotal || '').toLowerCase().includes(query) ||
            String(item.beratkendaraan || '').toLowerCase().includes(query) ||
            String(item.beratmuatan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredAsphaltMixingPlant = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return AsphaltMixingPlants.value.filter(item => {
            // 1. FILTER SEARCH GLOBAL (Cari di semua field)
            const matchesSearch = searchMatch(item, query);

            // 2. FILTER TANGGAL (Range)
            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

            // 3. FILTER PER KOLOM (Spesifik)
            // .every() memastikan SEMUA inputan kolom yang diisi harus terpenuhi
            const matchesColumns = Object.keys(columnFilters).every(key => {
                const filterVal = columnFilters[key].toLowerCase();
                if (!filterVal) return true; // Jika filter kosong, loloskan data

                switch (key) {
                    case 'material':
                        return String(item.material?.material || '').toLowerCase().includes(filterVal);
                    case 'tanggal':
                        return String(item.tanggal || '').toLowerCase().includes(filterVal);
                    case 'kode':
                        return String(item.kode || '').toLowerCase().includes(filterVal);
                    case 'kendaraan':
                        return String(item.kendaraan?.nomor || '').toLowerCase().includes(filterVal);
                    case 'driver':
                        return String(item.driver?.nama || '').toLowerCase().includes(filterVal);
                    case 'suplier':
                        return String(item.suplier?.nama || '').toLowerCase().includes(filterVal);
                    case 'volume':
                        return String(item.volume || '').toLowerCase().includes(filterVal);
                    case 'berattotal':
                        return String(item.berattotal || '').toLowerCase().includes(filterVal);
                    case 'beratkendaraan':
                        return String(item.beratkendaraan || '').toLowerCase().includes(filterVal);
                    case 'beratmuatan':
                        return String(item.beratmuatan || '').toLowerCase().includes(filterVal);
                    // ... case kolom lainnya
                    default: return true;
                }
            });

            // KEMBALIKAN DATA HANYA JIKA SEMUA KONDISI TRUE
            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        return filteredAsphaltMixingPlant.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.volume || 0);
            acc.beratTotal += Number(item.berattotal || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredAsphaltMixingPlant.value.length / itemsPerPage) || 1;
    });

    const paginatedAsphaltMixingPlant = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredAsphaltMixingPlant.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    // Tambahkan reset filter kolom
    const resetColumnFilters = () => {
        Object.keys(columnFilters).forEach(key => columnFilters[key] = '');
    };

    const displayedPages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 5; // Jumlah nomor yang ingin ditampilkan

        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    return {
        AsphaltMixingPlants,
        materialList,
        kendaraanList,
        driverList,
        suplierList,
        beratjenisList,
        selectedMaterialSatuan,
        isLoading,
        searchQuery,
        currentPage,
        currentTab,
        startDate,
        endDate,
        displayedPages,
        switchTab,
        isEdit,
        formAMP,
        errors,
        totalPages,
        totalFooter,
        columnFilters,
        resetColumnFilters,
        formatNumber,
        filteredAsphaltMixingPlant,
        paginatedAsphaltMixingPlant,
        fetchAMP,
        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchSuplier,
        fetchBeratJenis,
        handleCreate,
        handleEdit,
        handleDelete,
        handleRefresh,
        submitAMP,
        resetDateFilter
    };
}
