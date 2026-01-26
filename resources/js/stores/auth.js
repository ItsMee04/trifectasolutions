import { defineStore } from 'pinia'
import router from '@/router'
import { AuthService } from '../modules/auth/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    rememberMe: false,
    // Kita simpan authToken juga di sini sesuai respons controller Anda
    authToken: null
  }),

  actions: {
    async loginUser(credentials) {
      this.isLoading = true // Memicu "Memuat data..." di UI [cite: 2025-10-25]
      try {
        // 1. Simpan flag remember_me ke localStorage SEBELUM login agar persist mendeteksi storage yang benar
        localStorage.setItem('remember_me', credentials.remember ? 'true' : 'false');

        const response = await AuthService.login(credentials);

        // 2. Mapping data dari controller Laravel Anda
        this.authToken = response.data.access_token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.rememberMe = credentials.remember;

        router.push('/dashboard');
      } catch (error) {
        // Bersihkan flag jika login gagal
        localStorage.removeItem('remember_me');
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
        this.authToken = null;

        localStorage.removeItem('remember_me');
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
        router.push('/login');
      }
    }
  },

  persist: {
    // Memilih storage secara dinamis berdasarkan flag 'remember_me'
    storage: localStorage.getItem('remember_me') === 'true' ? localStorage : sessionStorage,
    paths: ['user', 'isAuthenticated', 'rememberMe', 'authToken'],
  },
})
