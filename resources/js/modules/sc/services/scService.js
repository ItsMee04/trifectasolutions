// services/stonecrusherService.js
import apiClient from '../../../helper/apiClient';

export const stonecrusherService = {
    async getStoneCrusher(payload) {
        const response = await apiClient.post('/stonecrusher/getStoneCrusher', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeStoneCrusher(payload) {
        const response = await apiClient.post('/stonecrusher/storeStoneCrusher', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateStoneCrusher(payload) {
        const response = await apiClient.post('/stonecrusher/updateStoneCrusher', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteStoneCrusher(payload) {
        const response = await apiClient.post('/stonecrusher/deleteStoneCrusher', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
