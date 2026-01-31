import { ref, computed, reactive } from 'vue';
import { kegiatanarmadaService } from '../../kegiatanarmada/services/kegiatanarmadaService'
import { jarakdanhargaService } from '../../jarakdanharga/services/jarakdanhargaService'
import { invoiceService } from '../services/invoiceService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const invoices = ref([]);
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});
const lastFilter = ref(null); // Penampung payload filter terakhir
// Tambahkan state baru di shared state (di luar export function)
const referensiJarakHarga = ref([]);
const showSuggestions = ref(false); // Untuk kontrol list di UI
const showSuggestionsTujuan = ref(false);

const formInvoice = reactive({
    id: null,
    tanggal: '',
    nomorinvoice: '',
    pengambilan: '',
    tujuan: '',
    kategori: '',
    periodeawal: '',
    periodeakhir: ''
});

export function useInvoice() {

    const fetchInvoice = async (filters = null) => {
        // Jika tidak ada filters (saat pertama kali load), jangan panggil API
        if (!filters) {
            invoices.value = [];
            return;
        }

        isLoading.value = true;
        try {
            // Mengirim filters (pengambilan, tujuan, kategori) sebagai payload
            const response = await invoiceService.getInvoice(filters);

            // Sesuai diskusi sebelumnya, pastikan parsing datanya tepat
            if (response && response.success) {
                invoices.value = response.data;
            } else {
                invoices.value = [];
            }
        } catch (error) {
            console.error("Gagal mengambil data Invoice:", error);
            invoices.value = [];
            notify.error("Gagal memuat data berdasarkan kriteria tersebut.");
        } finally {
            isLoading.value = false;
        }
    };

    const handleFilterInvoice = () => {
        errors.value = {};
        formInvoice.pengambilan = '';
        formInvoice.tujuan = '';
        formInvoice.kategori = '';

        const modal = new bootstrap.Modal(document.getElementById('modalFilterInvoice'));
        modal.show();
    };

    const handlePrintInvoice = () => {
        // 1. Cek apakah user sudah melakukan filter pencarian sebelumnya
        if (!lastFilter.value) {
            notify.error("Silakan filter data terlebih dahulu sebelum mencetak.");
            return;
        }

        formInvoice.pengambilan = '';
        formInvoice.tujuan = '';
        formInvoice.kategori = '';

        const modal = new bootstrap.Modal(document.getElementById('modalPrintInvoice'));
        modal.show();
    }

    const submitPrint = async () => {
        // 1. Validasi Input Modal Print
        errors.value = {};
        if (!formInvoice.tanggal) errors.value.tanggal = "Tanggal invoice wajib diisi.";
        if (!formInvoice.nomorinvoice) errors.value.nomorinvoice = "Nomor invoice wajib diisi.";

        if (Object.keys(errors.value).length > 0) return;

        // 2. Ambil semua ID dari filteredInvoice (data yang tampil di tabel saat ini)
        const selectedIds = filteredInvoice.value.map(item => item.id);

        if (selectedIds.length === 0) {
            notify.error("Tidak ada data kegiatan untuk di-invoice.");
            return;
        }

        // 3. Payload Lengkap
        const payload = {
            pengambilan: lastFilter.value.pengambilan,
            tujuan: lastFilter.value.tujuan,
            kategori: lastFilter.value.kategori,
            periodeawal: lastFilter.value.periodeawal,
            periodeakhir: lastFilter.value.periodeakhir,
            nomorinvoice: formInvoice.nomorinvoice,
            kegiatan_ids: selectedIds
        };

        isLoading.value = true;
        try {
            const response = await invoiceService.storeInvoice(payload);

            if (response.data.success) {
                notify.success("Invoice berhasil disimpan.");

                // Tutup modal print
                const modalElement = document.getElementById('modalPrintInvoice');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                // 4. BUKA TAB BARU UNTUK PRINT PREVIEW
                // Asumsi route backend untuk print adalah /invoice/print/{id}
                const printUrl = `/api/invoice/print/${response.data.data.id}`;
                window.open(printUrl, '_blank');

                // 5. Reset Tabel (Sesuai instruksi: Memuat data... lalu kosong)
                await handleRefresh();
            }
        } catch (error) {
            console.error(error);
            notify.error(error.response?.data?.message || "Gagal memproses invoice.");
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (!formInvoice.pengambilan || formInvoice.pengambilan.trim() === '') {
            errors.value.pengambilan = 'Pengambilan tidak boleh kosong.';
        }

        if (!formInvoice.tujuan || formInvoice.tujuan.trim() === '') {
            errors.value.tujuan = 'Tujuan tidak boleh kosong.';
        }

        if (!formInvoice.kategori || formInvoice.kategori.trim() === '') {
            errors.value.kategori = 'Kategori tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitGetInvoice = async () => {
        if (!validateForm()) return false;

        // Siapkan payload dari reactive form
        const payload = {
            pengambilan: formInvoice.pengambilan,
            tujuan: formInvoice.tujuan,
            kategori: formInvoice.kategori,
            periodeawal: formInvoice.periodeawal,
            periodeakhir: formInvoice.periodeakhir
        };

        lastFilter.value = { ...payload };

        const modalElement = document.getElementById('modalFilterInvoice');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        // Panggil fetch dengan payload
        await fetchInvoice(payload);
        return true;
    };

    const handleRefresh = async () => {
        isLoading.value = true;

        try {
            // 1. Reset State Pencarian
            lastFilter.value = null;
            searchQuery.value = '';
            currentPage.value = 1;

            // 2. Reset Range Tanggal (jika ada)
            startDate.value = '';
            endDate.value = '';

            // 3. Reset Form Modal
            formInvoice.pengambilan = '';
            formInvoice.tujuan = '';
            formInvoice.kategori = '';
            formInvoice.periodeawal = '';
            formInvoice.periodeakhir = '';

            // 4. Kosongkan Data Tabel (Sesuai keinginan: data kosong jika tidak ada filter)
            invoices.value = [];

            // 5. Panggil fetch tanpa parameter agar kembali ke state default (kosong)
            await fetchInvoice(null);

            notify.success('Halaman berhasil direset');
        } catch (error) {
            console.error("Gagal mereset data:", error);
        } finally {
            isLoading.value = false;
        }
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
            String(item.rit || '').toLowerCase().includes(query) ||
            String(item.volume || '').toLowerCase().includes(query) ||
            String(item.jarak?.hargajasa || '').toLowerCase().includes(query) ||
            String(item.penjualan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredInvoice = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return invoices.value.filter(item => {
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
        return filteredInvoice.value.reduce((acc, item) => {
            acc.ritTotal += Number(item.rit || 0);
            acc.volumeTotal += Number(item.volume || 0);
            acc.jasaTotal += Number(item.jarak?.hargajasa || 0);
            acc.penjualanTotal += Number(item.penjualan || 0);
            return acc;
        }, {
            ritTotal: 0,
            volumeTotal: 0,
            jasaTotal: 0,
            penjualanTotal: 0
        });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredInvoice.value.length / itemsPerPage) || 1;
    });

    const paginatedInvoice = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredInvoice.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    // Fungsi untuk mengambil referensi (Panggil ini saat onMounted di component)
    const fetchReferensiJarak = async () => {
        try {
            const response = await jarakdanhargaService.getJarakDanHarga(); // Asumsi nama servicenya
            if (response && response.success) {
                referensiJarakHarga.value = response.data;
            }
        } catch (error) {
            console.error("Gagal ambil referensi:", error);
        }
    };

    // Filter Autocomplete dengan Group By (Unique)
    const suggestionPengambilan = computed(() => {
        const query = formInvoice.pengambilan.toLowerCase();
        if (!query) return [];

        // 1. Filter berdasarkan ketikan
        const filtered = referensiJarakHarga.value.filter(item =>
            item.pengambilan.toLowerCase().includes(query)
        );

        // 2. Group By / Unique (Ambil hanya nama pengambilan yang unik)
        const uniqueNames = [...new Set(filtered.map(item => item.pengambilan))];

        return uniqueNames;
    });

    const suggestionTujuan = computed(() => {
        const query = formInvoice.tujuan.toLowerCase();
        if (!query) return [];

        const filtered = referensiJarakHarga.value.filter(item =>
            item.tujuan.toLowerCase().includes(query)
        );

        // Group By / Unique agar tidak duplikat
        return [...new Set(filtered.map(item => item.tujuan))];
    });

    const selectTujuan = (nama) => {
        formInvoice.tujuan = nama;
        showSuggestionsTujuan.value = false;
    };

    // Fungsi saat item saran dipilih
    const selectPengambilan = (nama) => {
        formInvoice.pengambilan = nama;
        showSuggestions.value = false;
    };

    return {
        invoices, isLoading, searchQuery, currentPage, startDate, endDate, isEdit, formInvoice,
        errors, lastFilter,
        suggestionPengambilan,
        showSuggestions,
        fetchReferensiJarak,
        selectPengambilan,
        suggestionTujuan,
        showSuggestionsTujuan,
        selectTujuan,
        totalPages,
        totalFooter,
        formatNumber,
        filteredInvoice,
        paginatedInvoice,
        fetchInvoice, handleFilterInvoice, handlePrintInvoice, handleRefresh, submitGetInvoice, submitPrint, resetDateFilter
    };
}
