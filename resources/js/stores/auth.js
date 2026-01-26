import { defineStore } from 'pinia'
import router from '@/router'
import { AuthService } from '@/modules/auth/services/AuthService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    // Tambahkan state ini untuk melacak pilihan user
    rememberMe: false
  }),

  actions: {
    async loginUser(credentials) {
      this.isLoading = true
      try {
        await AuthService.getCsrfCookie();

        // Kirim credentials (termasuk field 'remember') ke API Laravel
        const response = await AuthService.login(credentials);

        this.user = response.data.user;
        this.isAuthenticated = true;

        // Simpan preferensi remember me ke state
        this.rememberMe = credentials.remember;

        router.push('/dashboard');
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        await AuthService.logout();
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.rememberMe = false;
        // Bersihkan storage
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
        router.push('/login');
      }
    }
  },

  persist: {
    // LOGIC DYNAMIC STORAGE
    // Kita cek apakah di localStorage ada tanda 'remember'
    // Jika ya, gunakan localStorage agar tahan lama. Jika tidak, sessionStorage.
    storage: localStorage.getItem('remember_me') === 'true' ? localStorage : sessionStorage,
    paths: ['user', 'isAuthenticated', 'rememberMe'],
    // Fungsi ini dijalankan setelah state disimpan ke storage
    afterRestore: (context) => {
        // Sinkronisasi ulang jika diperlukan saat app di-refresh
        if (context.store.rememberMe) {
            localStorage.setItem('remember_me', 'true');
        } else {
            localStorage.setItem('remember_me', 'false');
        }
    }
  },
})
