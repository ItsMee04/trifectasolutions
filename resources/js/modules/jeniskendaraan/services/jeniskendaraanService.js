// services/JenisKendaraanervice.js
import apiClient from '../../../helper/apiClient';

export const jenisKendaraanService = {
    async getJenisKendaraan() {
        const response = await apiClient.get('/jeniskendaraan/getJenisKendaraan');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeJenisKendaraan(payload) {
        const response = await apiClient.post('/jeniskendaraan/storeJenisKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateJenisKendaraan(payload) {
        const response = await apiClient.post('/jeniskendaraan/updateJenisKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteJenisKendaraan(payload) {
        const response = await apiClient.post('/jeniskendaraan/deleteJenisKendaraan', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
