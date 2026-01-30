import { ref, computed, reactive } from 'vue';
import { concretebatchingplantService } from '../services/cbpService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { suplierService } from '../../suplier/services/suplierService'
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const ConcreteBatchingPlants = ref([]);
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

const formCBP = reactive({
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

export function useCBP() {

    const switchTab = async (tab) => {
        currentTab.value = tab;
        currentPage.value = 1;
        await fetchCBP(tab);
    };

    const fetchCBP = async (jenisValue = null) => {
        isLoading.value = true;
        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = { jenis: targetJenis };
            const response = await concretebatchingplantService.getConcreteBatchingPlant(payload);
            ConcreteBatchingPlants.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Concrete Batching Plant:", error);
            ConcreteBatchingPlants.value = [];
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

        if (!formCBP.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formCBP.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formCBP.volume === null || formCBP.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }

        if (formCBP.berattotal === null || formCBP.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }

        if (formCBP.beratkendaraan === null || formCBP.beratkendaraan === '') {
            errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitCBP = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formCBP.id,
                tanggal: formCBP.tanggal,
                material: formCBP.material_id,
                kendaraan: formCBP.kendaraan_id,
                driver: formCBP.driver_id,
                suplier: formCBP.suplier_id,
                jenis: formCBP.jenis,
                volume: formCBP.volume,
                berattotal: formCBP.berattotal,
                beratkendaraan: formCBP.beratkendaraan,
                beratmuatan: formCBP.beratmuatan,
            };

            let response;
            if (isEdit.value) {
                response = await concretebatchingplantService.updateConcreteBatchingPlant(payload);
            } else {
                response = await concretebatchingplantService.storeConcreteBatchingPlant(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalCBP');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchCBP();
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
        formCBP.id = null;
        formCBP.tanggal = '';
        formCBP.material_id = null;
        formCBP.kendaraan_id = null;
        formCBP.driver_id = null;
        formCBP.suplier_id = null;
        formCBP.jenis = currentTab.value;
        formCBP.volume = '';
        formCBP.berattotal = '';
        formCBP.beratkendaraan = '';
        formCBP.beratmuatan = '';

        const modal = new bootstrap.Modal(document.getElementById('modalCBP'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formCBP.id = item.id;
        formCBP.tanggal = item.tanggal;
        formCBP.material_id = item.material_id;
        formCBP.kendaraan_id = item.kendaraan_id;
        formCBP.driver_id = item.driver_id;
        formCBP.suplier_id = item.suplier_id;
        formCBP.jenis = item.jenis;
        formCBP.volume = item.volume;
        formCBP.berattotal = item.berattotal;
        formCBP.beratkendaraan = item.beratkendaraan;
        formCBP.beratmuatan = item.beratmuatan;

        const modal = new bootstrap.Modal(document.getElementById('modalCBP'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Concrete Batching Plant "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
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
                await concretebatchingplantService.deleteConcreteBatchingPlant(payload);
                notify.success('Concrete Batching Plant berhasil dihapus.');
                await fetchCBP();
            } catch (error) {
                notify.error('Gagal menghapus data Concrete Batching Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchCBP();
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
    const filteredConcreteBatchingPlant = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return ConcreteBatchingPlants.value.filter(item => {
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
        return filteredConcreteBatchingPlant.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.volume || 0);
            acc.beratTotal += Number(item.berattotal || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredConcreteBatchingPlant.value.length / itemsPerPage) || 1;
    });

    const paginatedConcreteBatchingPlant = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredConcreteBatchingPlant.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    return {
        ConcreteBatchingPlants, materialList, kendaraanList, driverList, suplierList, isLoading, searchQuery, currentPage, currentTab, startDate, endDate,
        switchTab, isEdit, formCBP, errors,
        totalPages,
        totalFooter,
        formatNumber,
        filteredConcreteBatchingPlant,
        paginatedConcreteBatchingPlant,
        fetchCBP, fetchMaterial, fetchKendaraan, fetchDriver, fetchSuplier, handleCreate, handleEdit, handleDelete, handleRefresh, submitCBP, resetDateFilter
    };
}
