// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const kegiatanarmadaService = {
    async getgetKegiatanArmada() {
        const response = await apiClient.get('/kegiatanarmada/getKegiatanArmada');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storegetKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/storeKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updategetKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/updateKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deletegetKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/deleteKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
