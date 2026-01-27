import { ref, computed, reactive } from 'vue';
import { usersService } from '../services/usersService';
import { notify } from '../../../helper/notification';
import { roleService } from '../../role/services/roleService';

// Shared State
const users = ref([]);
const roles = ref([]); // 1. TAMBAHKAN state roles untuk menampung data dari API
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const formUsers = reactive({
    id: null,
    nama: '',
    email: '',
    password: '',
    role_id: null, // 2. UBAH 'role' menjadi 'role_id' agar cocok dengan value Multiselect (ID)
});

export function useUsers() {

    const fetchUsers = async () => {
        isLoading.value = true;
        try {
            const response = await usersService.getUsers();
            users.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            users.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // 3. TAMBAHKAN fungsi fetchRoles untuk mengisi pilihan di Multiselect
    const fetchRoles = async () => {
        try {
            const response = await roleService.getRoles();
            // Map data agar formatnya { value: id, label: 'nama' } sesuai standar Multiselect
            roles.value = response.data.map(role => ({
                value: role.id,
                label: role.role // Sesuaikan field 'role' dengan nama kolom di tabel roles Anda
            }));
        } catch (error) {
            console.error("Gagal memuat roles:", error);
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formUsers.email || formUsers.email.trim() === '') {
            errors.value.email = 'Email tidak boleh kosong.';
        }
        // 4. TAMBAHKAN validasi role
        if (!formUsers.role_id) {
            errors.value.role_id = 'Pilih Role terlebih dahulu.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const submitUsers = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            const payload = {
                id: formUsers.id,
                email: formUsers.email,
                password: formUsers.password,
                role_id: formUsers.role_id // 5. Kirim role_id (integer) ke backend
            };

            let response;
            if (isEdit.value) {
                response = await usersService.updateUsers(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');

            const modalElement = document.getElementById('modalUsers');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchUsers();
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

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formUsers.id = item.id;
        formUsers.nama = item.pegawai?.nama || '-';
        formUsers.email = item.email;
        formUsers.password = ''; // 6. Kosongkan password saat edit (keamanan & logika Laravel)
        formUsers.role_id = item.role_id; // 7. Pastikan mengambil role_id, bukan objek role

        const modal = new bootstrap.Modal(document.getElementById('modalUsers'));
        modal.show();
    };

    const handleRefresh = async () => {
        await fetchUsers();
    }

    // --- Tambahkan Logic Pagination ---
    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = users.value.filter(item =>
            (item.pegawai?.nama || '').toLowerCase().includes(query) || // Gunakan query
            (item.email || '').toLowerCase().includes(query) ||         // Gunakan query
            (item.role?.role || '').toLowerCase().includes(query)
        ).length;

        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

    return {
        users, roles, isLoading, searchQuery, currentPage, isEdit, formUsers, errors, totalPages,
        filteredUsers: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return users.value.filter(item => {
                return (
                    (item.pegawai?.nama || '').toLowerCase().includes(query) ||
                    (item.email || '').toLowerCase().includes(query) ||
                    (item.role?.role || '').toLowerCase().includes(query) // Pastikan path relasi role benar
                );
            }
            );
        }),
        paginatedUsers: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = users.value.filter(item => {
                return (
                    (item.pegawai?.nama || '').toLowerCase().includes(query) ||
                    (item.email || '').toLowerCase().includes(query) ||
                    (item.role?.role || '').toLowerCase().includes(query)
                );
            });
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),
        fetchUsers, fetchRoles, handleEdit, handleRefresh, submitUsers
    };
}
