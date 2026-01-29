import { ref, computed, reactive } from 'vue';
import { jarakdanhargaService } from '../services/jarakdanhargaService';
import { materialService } from '../../material/services/materialService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const JarakHarga = ref([]);
const materialList = ref([]);
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const formJarakDanHarga = reactive({
    id: null,
    material_id: null,
    pengambilan: '',
    tujuan: '',
    jarak: '',
    hargaupah: '',
    hargajasa: '',
});

export function useJarakDanHarga() {

    const fetchJarakDanHarga = async () => {
        isLoading.value = true;

        try {
            const response = await jarakdanhargaService.getJarakDanHarga();
            JarakHarga.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Jarak & Harga:", error);
            JarakHarga.value = [];
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

    const validateForm = () => {
        errors.value = {};

        if (!formJarakDanHarga.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (!formJarakDanHarga.pengambilan || formJarakDanHarga.pengambilan.trim() === '') {
            errors.value.pengambilan = 'Pengambilan tidak boleh kosong.';
        }

        if (!formJarakDanHarga.tujuan || formJarakDanHarga.tujuan.trim() === '') {
            errors.value.tujuan = 'Tujuan tidak boleh kosong.';
        }

        if (formJarakDanHarga.jarak === null || formJarakDanHarga.jarak === '') {
            errors.value.jarak = 'Jarak tidak boleh kosong.';
        }

        if (formJarakDanHarga.hargaupah === null || formJarakDanHarga.hargaupah === '') {
            errors.value.hargaupah = 'Harga Upah Driver Total tidak boleh kosong.';
        }

        if (formJarakDanHarga.hargajasa === null || formJarakDanHarga.hargajasa === '') {
            errors.value.hargajasa = 'Harga Jasa Angkut boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitJarakDanHarga = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formJarakDanHarga.id,
                material: formJarakDanHarga.material_id,
                pengambilan: formJarakDanHarga.pengambilan,
                tujuan: formJarakDanHarga.tujuan,
                jarak: formJarakDanHarga.jarak,
                hargaupah: formJarakDanHarga.hargaupah,
                hargajasa: formJarakDanHarga.hargajasa,
            };

            let response;
            if (isEdit.value) {
                response = await jarakdanhargaService.updateJarakDanHarga(payload);
            } else {
                response = await jarakdanhargaService.storeJarakDanHarga(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalJarak');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchJarakDanHarga();
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
        formJarakDanHarga.id = null;
        formJarakDanHarga.material_id = null;
        formJarakDanHarga.pengambilan = '';
        formJarakDanHarga.tujuan = '';
        formJarakDanHarga.jarak = '';
        formJarakDanHarga.hargaupah = '';
        formJarakDanHarga.hargajasa = '';

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formJarakDanHarga.id = item.id;
        formJarakDanHarga.material_id = item.material_id;
        formJarakDanHarga.pengambilan = item.pengambilan;
        formJarakDanHarga.tujuan = item.tujuan;
        formJarakDanHarga.jarak = item.jarak;
        formJarakDanHarga.hargaupah = item.hargaupah;
        formJarakDanHarga.hargajasa = item.hargajasa;

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Jarak & Harga "${item.kode}" yang dihapus tidak dapat dikembalikan!`,
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
                await jarakdanhargaService.deleteJarakDanHarga(payload);
                notify.success('Data Harga & Jarak berhasil dihapus.');
                await fetchJarakDanHarga();
            } catch (error) {
                notify.error('Gagal menghapus data Harga & Jarak.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchJarakDanHarga();
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
            String(item.pengambilan || '').toLowerCase().includes(query) ||
            String(item.tujuan || '').toLowerCase().includes(query) ||
            String(item.jarak || '').toLowerCase().includes(query) ||
            String(item.hargaupah || '').toLowerCase().includes(query) ||
            String(item.hargajasa || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredJarakDanHarga = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return JarakHarga.value.filter(item => {
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
        return filteredJarakDanHarga.value.reduce((acc, item) => {
            acc.jarakTotal += parseFloat(item.jarak || 0);
            acc.upahTotal += Number(item.hargaupah || 0);
            acc.jasaTotal += Number(item.hargajasa || 0);
            return acc;
        }, { jarakTotal: 0, upahTotal: 0, jasaTotal: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredJarakDanHarga.value.length / itemsPerPage) || 1;
    });

    const paginatedJarakDanHarga = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredJarakDanHarga.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    return {
        JarakHarga, materialList, isLoading, searchQuery, currentPage, startDate, endDate, isEdit, formJarakDanHarga,
        errors,
        totalPages,
        totalFooter,
        formatNumber,
        filteredJarakDanHarga,
        paginatedJarakDanHarga,
        fetchJarakDanHarga, fetchMaterial, handleCreate, handleEdit, handleDelete, handleRefresh, submitJarakDanHarga, resetDateFilter
    };
}
