import { ref, computed, reactive, watch } from 'vue';
import { asphaltmixingplantService } from '../services/ampService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { suplierService } from '../../suplier/services/suplierService'
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const AsphaltMixingPlants = ref([]);
const materialList = ref([]);
const kendaraanList = ref([]);
const driverList = ref([]);
const suplierList = ref([]);
const currentTab = ref('IN');
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const formAMP = reactive({
    id: null,
    kode: '',
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    suplier_id: null,
    jenis: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: ''
});

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
            materialList.value = response.data.map(item => ({
                value: item.id,
                label: item.material
            }))
        } catch (error) {
            console.log("Gagal memuat material:", error)
        }
    }

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
                jenis: formAMP.jenis,
                volume: formAMP.volume,
                berattotal: formAMP.berattotal,
                beratkendaraan: formAMP.beratkendaraan,
                beratmuatan: formAMP.beratmuatan,
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
        formAMP.tanggal = '';
        formAMP.material_id = null;
        formAMP.kendaraan_id = null;
        formAMP.driver_id = null;
        formAMP.suplier_id = null;
        formAMP.jenis = currentTab.value;
        formAMP.volume = '';
        formAMP.berattotal = '';
        formAMP.beratkendaraan = '';
        formAMP.beratmuatan = '';

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

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formAMP.id = item.id;
        formAMP.tanggal = item.tanggal;
        formAMP.material_id = item.material_id;
        formAMP.kendaraan_id = item.kendaraan_id;
        formAMP.driver_id = item.driver_id;
        formAMP.suplier_id = item.suplier_id;
        formAMP.jenis = item.jenis;
        formAMP.volume = item.volume;
        formAMP.berattotal = item.berattotal;
        formAMP.beratkendaraan = item.beratkendaraan;
        formAMP.beratmuatan = item.beratmuatan;

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
            const matchesSearch = searchMatch(item, query);

            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

            return matchesSearch && matchesDate;
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
        AsphaltMixingPlants, materialList, kendaraanList, driverList, suplierList, isLoading, searchQuery, currentPage, currentTab, startDate, endDate, displayedPages,
        switchTab, isEdit, formAMP, errors,
        totalPages,
        totalFooter,
        formatNumber,
        filteredAsphaltMixingPlant,
        paginatedAsphaltMixingPlant,
        fetchAMP, fetchMaterial, fetchKendaraan, fetchDriver, fetchSuplier, handleCreate, handleEdit, handleDelete, handleRefresh, submitAMP, resetDateFilter
    };
}
