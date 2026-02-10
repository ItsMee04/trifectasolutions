// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const truckmixerService = {
    async getInvoiceTruckMixer() {
        const response = await apiClient.get('/truckmixer/getInvoiceTruckMixer');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeKategori(payload) {
        const response = await apiClient.post('/truckmixer/storeKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateKategori(payload) {
        const response = await apiClient.post('/truckmixer/updateKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteKategori(payload) {
        const response = await apiClient.post('/truckmixer/deleteKategori', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
