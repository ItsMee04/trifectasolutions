// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const kategoriService = {
    async getKategori() {
        const response = await apiClient.get('/kategori/getKategori');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeKategori(payload) {
        const response = await apiClient.post('/kategori/storeKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateKategori(payload) {
        const response = await apiClient.post('/kategori/updateKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteKategori(payload) {
        const response = await apiClient.post('/kategori/deleteKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
