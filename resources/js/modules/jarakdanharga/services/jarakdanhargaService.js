// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const jarakdanhargaService = {
    async getJarakDanHarga(payload) {
        const response = await apiClient.post('/jarakdanharga/getJarakDanHarga', payload);
        return response.data;
    },

    async storeJarakDanHarga(payload) {
        const response = await apiClient.post('/jarakdanharga/storeJarakDanHarga', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateJarakDanHarga(payload) {
        const response = await apiClient.post('/jarakdanharga/updateJarakDanHarga', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteJarakDanHarga(payload) {
        const response = await apiClient.post('/jarakdanharga/deleteJarakDanHarga', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
