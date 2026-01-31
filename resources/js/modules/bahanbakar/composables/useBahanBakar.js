import { ref, computed, reactive } from 'vue';
import { bahanbakarService } from '../services/bahanbakarService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const bahanbakars = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formBahanBakar = reactive({
    id: null,
    jenis: '',
    indexperkm: '',
});

export function useBahanBakar() {

    const fetchBahanBakar = async () => {
        isLoading.value = true;
        try {
            const response = await bahanbakarService.getBahanBakar();
            bahanbakars.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            bahanbakars.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formBahanBakar.jenis || formBahanBakar.jenis.trim() === '') {
            errors.value.jenis = 'Jenis tidak boleh kosong.';
        }
        if (formBahanBakar.indexperkm === null || formBahanBakar.indexperkm === '') {
            errors.value.indexperkm = 'Index Per KM tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitBahanBakar = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                jenis: formBahanBakar.jenis,
                indexperkm: formBahanBakar.indexperkm,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formBahanBakar.id;
                response = await bahanbakarService.updateBahanBakar(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await bahanbakarService.storeBahanBakar(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalBahanBakar');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchBahanBakar();

            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                // 1. Simpan error untuk ditampilkan di bawah input field
                errors.value = error.response.data.errors;

                // 2. ✨ TAMBAHKAN INI: Munculkan notify agar user tahu ada yang salah
                const firstErrorMessage = error.response.data.message || 'Terjadi kesalahan validasi.';
                notify.error(firstErrorMessage);
            } else {
                // Untuk error server (500), koneksi, dsb.
                notify.error(error.response?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        formBahanBakar.id = null;
        formBahanBakar.jenis = '';
        formBahanBakar.indexperkm = '';

        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalBahanBakar'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formBahanBakar.id = item.id;
        formBahanBakar.jenis = item.jenis;
        formBahanBakar.indexperkm = item.indexperkm;

        const modal = new bootstrap.Modal(document.getElementById('modalBahanBakar'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Bahan Bakar "${item.jenis}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true // Opsional: menukar posisi tombol Batal & Hapus
        });

        if (result.isConfirmed) {
            isLoading.value = true; // Set loading agar UI tetap konsisten [cite: 2025-10-25]
            try {
                // 📦 Siapkan Payload
                const payload = {
                    id: item.id,
                };
                // Mengirim payload id sesuai kebutuhan service Anda
                await bahanbakarService.deleteBahanBakar(payload);

                notify.success('Bahan Bakar berhasil dihapus.');

                // Memanggil fetchDriver agar tabel terupdate otomatis tanpa reload
                await fetchBahanBakar();
            } catch (error) {
                console.error('Gagal menghapus data Bahan Bakar:', error);
                notify.error('Gagal menghapus data Bahan Bakar.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchBahanBakar();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = bahanbakars.value.filter(item =>
            (item.jenis || '').toLowerCase().includes(query) ||
            (item.indexperkm || '').toLowerCase().includes(query)
        ).length;

        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

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
        bahanbakars, isLoading, searchQuery, currentPage, isEdit, formBahanBakar, errors, totalPages, displayedPages,
        filteredBahanBakar: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return bahanbakars.value.filter(item =>
                (item.jenis || '').toLowerCase().includes(query) ||
                (item.indexperkm || '').toLowerCase().includes(query)
            );
        }),
        paginatedBahanBakar: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (bahanbakars.value.filter(item =>
                (item.jenis || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                (item.indexperkm || '').toLowerCase().includes(searchQuery.value.toLowerCase())
            ))
                .slice(start, start + itemsPerPage);
        }),
        fetchBahanBakar, handleCreate, handleEdit, handleDelete, handleRefresh, submitBahanBakar
    };
}
