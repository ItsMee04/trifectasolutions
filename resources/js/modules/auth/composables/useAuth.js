import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 1. Import Store
import { notify } from '../../../helper/notification';

export function useAuth() {
    const router = useRouter();
    const authStore = useAuthStore(); // 2. Inisialisasi Store
    const loading = ref(false);
    const errors = ref({});
    const form = ref({
        email: '',
        password: '',
        remember: false
    });

    const validate = () => {
        errors.value = {};
        let isValid = true;

        if (!form.value.email) {
            errors.value.email = 'Email wajib diisi.';
            isValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(form.value.email)) {
                errors.value.email = 'Format email tidak valid.';
                isValid = false;
            }
        }
        if (!form.value.password) {
            errors.value.password = 'Password wajib diisi.';
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) {
            notify.error("Silakan lengkapi form login.");
            return;
        }

        loading.value = true;

        try {
            // 3. Set flag untuk Pinia Persist sebelum login
            if (form.value.remember) {
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.setItem('remember_me', 'false');
            }

            // 4. Panggil action loginUser dari Store (Bukan langsung ke Service)
            // Store yang akan mengurus AuthService, State, dan Routing
            await authStore.loginUser(form.value);

            notify.success("Login Berhasil!");
        } catch (error) {
            console.error("Login Error:", error);
            // Menangani error dari backend (misal: 401 Unauthorized)
            const msg = error.response?.data?.message || "Email atau password salah";
            notify.error(msg);
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        loading,
        errors,
        handleLogin
    };
}
