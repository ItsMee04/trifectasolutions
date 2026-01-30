// services/BahanBakarervice.js
import apiClient from '../../../helper/apiClient';

export const bahanbakarService = {
    async getBahanBakar() {
        const response = await apiClient.get('/bahanbakar/getBahanBakar');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeBahanBakar(payload) {
        const response = await apiClient.post('/bahanbakar/storeBahanBakar', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateBahanBakar(payload) {
        const response = await apiClient.post('/bahanbakar/updateBahanBakar', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteBahanBakar(payload) {
        const response = await apiClient.post('/bahanbakar/deleteBahanBakar', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
