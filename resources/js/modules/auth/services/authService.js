import apiClient from '@/Helper/apiClient';

export const AuthService = {
    async login(credentials) {
        // Jangan hanya return response.data, kembalikan seluruh response
        // agar Store bisa membaca response.data.access_token
        return await apiClient.post('/login', credentials);
    },

    async logout() {
        return await apiClient.post('/logout');
    }
};
