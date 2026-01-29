// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const kegiatanarmadaService = {
    async getKegiatanArmada() {
        const response = await apiClient.get('/kegiatanarmada/getKegiatanArmada');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/storeKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/updateKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteKegiatanArmada(payload) {
        const response = await apiClient.post('/kegiatanarmada/deleteKegiatanArmada', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
