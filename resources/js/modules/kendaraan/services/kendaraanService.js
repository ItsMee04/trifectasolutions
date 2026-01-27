// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const kendaraanService = {
    async getKendaraan() {
        const response = await apiClient.get('/kendaraan/getKendaraan');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeKendaraan(payload) {
        const response = await apiClient.post('/kendaraan/storeKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateKendaraan(payload) {
        const response = await apiClient.post('/kendaraan/updateKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteKendaraan(payload) {
        const response = await apiClient.post('/kendaraan/deleteKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
