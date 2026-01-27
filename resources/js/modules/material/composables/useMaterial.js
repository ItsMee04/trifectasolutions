import { ref, computed, reactive } from 'vue';
import { materialService } from '../services/materialService';
import { kategoriService } from '../../kategori/services/kategoriService'
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const materials = ref([]);
const kategori = ref([]); // 1. TAMBAHKAN state roles untuk menampung data dari API
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const formMaterial = reactive({
    id: null,
    kode: '',
    kategori_id: null,
    material: '', // 2. UBAH 'role' menjadi 'role_id' agar cocok dengan value Multiselect (ID)
});

export function useMaterial() {

    const fetchMaterial = async () => {
        isLoading.value = true;
        try {
            const response = await materialService.getMaterial();
            materials.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            materials.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // 3. TAMBAHKAN fungsi fetchKategori untuk mengisi pilihan di Multiselect
    const fetchKategori = async () => {
        try {
            const response = await kategoriService.getKategori();
            // Map data agar formatnya { value: id, label: 'nama' } sesuai standar Multiselect
            kategori.value = response.data.map(kategori => ({
                value: kategori.id,
                label: kategori.kategori // Sesuaikan field 'role' dengan nama kolom di tabel roles Anda
            }));
        } catch (error) {
            console.error("Gagal memuat kategori:", error);
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formMaterial.material || formMaterial.material.trim() === '') {
            errors.value.material = 'Material tidak boleh kosong.';
        }
        // 4. TAMBAHKAN validasi kategori
        if (!formMaterial.kategori_id) {
            errors.value.kategori_id = 'Pilih Kategori terlebih dahulu.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const submitMaterial = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            const payload = {
                id: formMaterial.id,
                material: formMaterial.material,
                kategori: formMaterial.kategori_id // 5. Kirim role_id (integer) ke backend
            };

            let response;
            if (isEdit.value) {
                payload.id = formMaterial.id;
                response = await materialService.updateMaterial(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await materialService.storeMaterial(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');

            const modalElement = document.getElementById('modalMaterial');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchMaterial();
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
        formMaterial.id = null;
        formMaterial.material = '';
        formMaterial.kategori_id = null; // 7. Pastikan mengambil role_id, bukan objek role

        const modal = new bootstrap.Modal(document.getElementById('modalMaterial'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formMaterial.id = item.id;
        formMaterial.material = item.material;
        formMaterial.kategori_id = item.kategori_id; // 7. Pastikan mengambil role_id, bukan objek role

        const modal = new bootstrap.Modal(document.getElementById('modalMaterial'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data material "${item.material}" yang dihapus tidak dapat dikembalikan!`,
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
                await materialService.deleteMaterial(payload);

                notify.success('Material berhasil dihapus.');

                // Memanggil fetchKendaraan agar tabel terupdate otomatis tanpa reload
                await fetchMaterial();
            } catch (error) {
                console.error('Gagal menghapus data Material:', error);
                notify.error('Gagal menghapus data Material.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchMaterial();
    }

    return {
        materials, kategori, isLoading, searchQuery, currentPage, isEdit, formMaterial, errors,
        filteredMaterial: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return materials.value.filter(item => {
                return (
                    (item.kategori?.kategori || '').toLowerCase().includes(query) ||
                    (item.material || '').toLowerCase().includes(query) // Pastikan path relasi role benar
                );
            }
            );
        }),
        paginatedMaterial: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = materials.value.filter(item => {
                return (
                    (item.kategori?.kategori || '').toLowerCase().includes(query) ||
                    (item.material || '').toLowerCase().includes(query)
                );
            });
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),
        fetchMaterial, fetchKategori, handleCreate, handleEdit, handleDelete, handleRefresh, submitMaterial
    };
}
