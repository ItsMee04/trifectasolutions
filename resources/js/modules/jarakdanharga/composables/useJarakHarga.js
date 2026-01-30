import { ref, computed, reactive } from 'vue';
import { jarakdanhargaService } from '../services/jarakdanhargaService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const JarakHarga = ref([]);
const showSuggestionsPengambilan = ref(false);
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
    pengambilan: '',
    tujuan: '',
    jarak: '',
    hargaupah: '',
    hargajasa: '',
    hargasolar: ''
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

    const validateForm = () => {
        errors.value = {};

        if (formJarakDanHarga.jarak === null || formJarakDanHarga.jarak === '') {
            errors.value.jarak = 'Jarak tidak boleh kosong.';
        } else if (String(formJarakDanHarga.jarak).includes(',')) {
            // Mengecek jika ada karakter koma
            errors.value.jarak = 'Gunakan titik (.) sebagai pemisah desimal, bukan koma.';
        } else if (isNaN(formJarakDanHarga.jarak)) {
            // Opsional: Memastikan input adalah angka valid
            errors.value.jarak = 'Jarak harus berupa angka valid.';
        }

        if (formJarakDanHarga.hargaupah === null || formJarakDanHarga.hargaupah === '') {
            errors.value.hargaupah = 'Harga Upah Driver Total tidak boleh kosong.';
        }

        if (formJarakDanHarga.hargajasa === null || formJarakDanHarga.hargajasa === '') {
            errors.value.hargajasa = 'Harga Jasa Angkut boleh kosong.';
        }

        if (formJarakDanHarga.hargasolar === null || formJarakDanHarga.hargasolar === '') {
            errors.value.hargasolar = 'Harga Jasa Angkut boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitJarakDanHarga = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formJarakDanHarga.id,
                pengambilan: formJarakDanHarga.pengambilan,
                tujuan: formJarakDanHarga.tujuan,
                jarak: formJarakDanHarga.jarak,
                hargaupah: formJarakDanHarga.hargaupah,
                hargajasa: formJarakDanHarga.hargajasa,
                hargasolar: formJarakDanHarga.hargasolar
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

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formJarakDanHarga.id = item.id;
        formJarakDanHarga.pengambilan = item.pengambilan;
        formJarakDanHarga.tujuan = item.tujuan;
        formJarakDanHarga.jarak = item.jarak;
        formJarakDanHarga.hargaupah = item.hargaupah;
        formJarakDanHarga.hargajasa = item.hargajasa;
        formJarakDanHarga.hargasolar = item.hargasolar;

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
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
            String(item.source?.material?.material || '').toLowerCase().includes(query) ||
            String(item.pengambilan || '').toLowerCase().includes(query) ||
            String(item.tujuan || '').toLowerCase().includes(query) ||
            String(item.jarak || '').toLowerCase().includes(query) ||
            String(item.hargaupah || '').toLowerCase().includes(query) ||
            String(item.hargajasa || '').toLowerCase().includes(query) ||
            String(item.hargasolar || '').toLowerCase().includes(query)
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
            acc.hargasolarTotal += Number(item.hargasolar || 0);
            return acc;
        }, { jarakTotal: 0, upahTotal: 0, jasaTotal: 0, hargasolarTotal: 0 });
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

    // Computed untuk memfilter supplier berdasarkan input "Pengambilan"
    const filteredSupplierSuggestions = computed(() => {
        const query = formJarakDanHarga.pengambilan.toLowerCase();
        if (!query) return [];

        return supplierList.value
            .filter(sup => sup.nama.toLowerCase().includes(query))
            .map(sup => sup.nama); // Ambil namanya saja
    });

    const selectPengambilan = (nama) => {
        formJarakDanHarga.pengambilan = nama;
        showSuggestionsPengambilan.value = false;
    };

    return {
        JarakHarga, isLoading, searchQuery, currentPage, startDate, endDate, isEdit, formJarakDanHarga,
        errors,
        totalPages,
        totalFooter,
        formatNumber,
        filteredJarakDanHarga,
        paginatedJarakDanHarga,
        showSuggestionsPengambilan,
        filteredSupplierSuggestions,
        selectPengambilan,
        fetchJarakDanHarga, handleEdit, handleRefresh, submitJarakDanHarga, resetDateFilter
    };
}
