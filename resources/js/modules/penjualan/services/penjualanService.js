// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const penjualanService = {
    async getPenjualan() {
        const response = await apiClient.get('/penjualan/getPenjualan');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storePenjualan(payload) {
        const response = await apiClient.post('/penjualan/storePenjualan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updatePenjualan(payload) {
        const response = await apiClient.post('/penjualan/updatePenjualan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deletePenjualan(payload) {
        const response = await apiClient.post('/penjualan/deletePenjualan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
