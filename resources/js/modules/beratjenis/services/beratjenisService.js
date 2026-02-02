// services/BeratJenisServce.js
import apiClient from '../../../helper/apiClient';

export const beratjenisService = {
    async getBeratJenis() {
        const response = await apiClient.get('/beratjenis/getBeratJenis');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeBeratJenis(payload) {
        const response = await apiClient.post('/beratjenis/storeBeratJenis', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateBeratJenis(payload) {
        const response = await apiClient.post('/beratjenis/updateBeratJenis', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteBeratJenis(payload) {
        const response = await apiClient.post('/beratjenis/deleteBeratJenis', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
