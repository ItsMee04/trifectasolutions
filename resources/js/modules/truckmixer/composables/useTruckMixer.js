import { ref, computed, reactive } from 'vue';
import { truckmixerService } from '../services/truckmixerService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const TruckMixers = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

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

export function useTruckMixer() {

    const fetchTruckMixer = async () => {
        isLoading.value = true;
        try {
            const response = await truckmixerService.getInvoiceTruckMixer();
            TruckMixers.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            TruckMixers.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // // --- LOGIKA VALIDASI ---
    // const validateForm = () => {
    //     errors.value = {}; // Reset error
    //     if (!formKategori.kategori || formKategori.kategori.trim() === '') {
    //         errors.value.kategori = 'Kategori tidak boleh kosong.';
    //     }
    //     return Object.keys(errors.value).length === 0;
    // };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    // const submitKategori = async () => {
    //     if (!validateForm()) return false;

    //     isLoading.value = true;
    //     try {
    //         // 📦 Siapkan Payload
    //         const payload = {
    //             kategori: formKategori.kategori,
    //         };

    //         let response;
    //         if (isEdit.value) {
    //             // Mode Edit: Kirim ID dan Payload
    //             payload.id = formKategori.id;
    //             response = await kategoriService.updateKategori(payload);
    //         } else {
    //             // Mode Tambah: Kirim Payload saja
    //             response = await kategoriService.storeKategori(payload);
    //         }

    //         notify.success(response.message || 'Data berhasil disimpan');

    //         // Tutup Modal
    //         const modalElement = document.getElementById('modalKategori');
    //         const modalInstance = bootstrap.Modal.getInstance(modalElement);
    //         if (modalInstance) modalInstance.hide();

    //         // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
    //         await fetchKategori();

    //         return true;
    //     } catch (error) {
    //         if (error.response?.status === 422) {
    //             // 1. Simpan error untuk ditampilkan di bawah input field
    //             errors.value = error.response.data.errors;

    //             // 2. ✨ TAMBAHKAN INI: Munculkan notify agar user tahu ada yang salah
    //             const firstErrorMessage = error.response.data.message || 'Terjadi kesalahan validasi.';
    //             notify.error(firstErrorMessage);
    //         } else {
    //             // Untuk error server (500), koneksi, dsb.
    //             notify.error(error.response?.message || 'Gagal menyimpan data.');
    //         }
    //         return false;
    //     } finally {
    //         isLoading.value = false;
    //     }
    // };

    // const handleCreate = () => {
    //     isEdit.value = false;
    //     formKategori.id = null;
    //     formKategori.kategori = '';
    //     errors.value = {};
    //     const modal = new bootstrap.Modal(document.getElementById('modalKategori'));
    //     modal.show();
    // };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formKategori.id = item.id;
        formKategori.kategori = item.kategori;
        const modal = new bootstrap.Modal(document.getElementById('modalKategori'));
        modal.show();
    };

    // const handleDelete = async (item) => {
    //     const result = await Swal.fire({
    //         title: 'Apakah Anda yakin?',
    //         text: `Data Kategori "${item.kategori}" yang dihapus tidak dapat dikembalikan!`,
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Ya, hapus!',
    //         cancelButtonText: 'Batal',
    //         reverseButtons: true // Opsional: menukar posisi tombol Batal & Hapus
    //     });

    //     if (result.isConfirmed) {
    //         isLoading.value = true; // Set loading agar UI tetap konsisten [cite: 2025-10-25]
    //         try {
    //             // 📦 Siapkan Payload
    //             const payload = {
    //                 id: item.id,
    //             };
    //             // Mengirim payload id sesuai kebutuhan service Anda
    //             await kategoriService.deleteKategori(payload);

    //             notify.success('Kategori berhasil dihapus.');

    //             // Memanggil fetchKategori agar tabel terupdate otomatis tanpa reload
    //             await fetchKategori();
    //         } catch (error) {
    //             console.error('Gagal menghapus data Kategori:', error);
    //             notify.error('Gagal menghapus data Kategori.');
    //         } finally {
    //             isLoading.value = false;
    //         }
    //     }
    // };

    const handleRefresh = async () => {
        await fetchTruckMixer();
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
            String(item.tanggal || '').toLowerCase().includes(query) ||
            String(item.jarak?.tujuan || '').toLowerCase().includes(query) ||
            String(item.jarak?.source?.volume || '').toLowerCase().includes(query) ||
            String(item.jarak?.jarak || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredTruckMixer = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return TruckMixers.value.filter(item => {
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
                    case 'tanggal':
                        return String(item.tanggal || '').toLowerCase().includes(filterVal);
                    case 'tujuan':
                        return String(item.jarak?.tujuan || '').toLowerCase().includes(filterVal);
                    case 'volume':
                        return String(item.jarak?.source?.volume || '').toLowerCase().includes(filterVal);
                    case 'jarak':
                        return String(item.jarak?.jarak || '').toLowerCase().includes(filterVal);
                    // ... case kolom lainnya
                    default: return true;
                }
            });

            // KEMBALIKAN DATA HANYA JIKA SEMUA KONDISI TRUE
            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        return filteredTruckMixer.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.jarak?.source?.volume || 0);
            acc.jarakTotal += parseFloat(item.jarak?.jarak || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, jarakTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredTruckMixer.value.length / itemsPerPage) || 1;
    });

    const paginatedTruckMixer = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredTruckMixer.value.slice(start, start + itemsPerPage);
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
        TruckMixers,
        isLoading,
        searchQuery,
        currentPage,
        startDate,
        endDate,
        displayedPages,
        isEdit,
        errors,
        totalPages,
        totalFooter,
        columnFilters,
        resetColumnFilters,
        formatNumber,
        filteredTruckMixer,
        paginatedTruckMixer,
        fetchTruckMixer,
        handleEdit,
        handleRefresh,
        resetDateFilter
    };
}
