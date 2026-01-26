import apiClient from '@/Helper/apiClient';

export const AuthService = {
    // Wajib dipanggil untuk SPA (Sanctum)
    async getCsrfCookie() {
        return await apiClient.get('/../sanctum/csrf-cookie');
    },

    async login(credentials) {
        // credentials berisi { email, password, remember }
        return await apiClient.post('/login', credentials);
    },

    async logout() {
        return await apiClient.post('/logout');
    }
};
