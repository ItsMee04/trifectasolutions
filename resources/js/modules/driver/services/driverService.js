// services/DriverService.js
import apiClient from '../../../helper/apiClient';

export const driverService = {
    async getDrivers() {
        const response = await apiClient.get('/driver/getDriver');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeDrivers(payload) {
        const response = await apiClient.post('/driver/storeDriver', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateDrivers(payload) {
        const response = await apiClient.post('/driver/updateDriver', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteDrivers(payload) {
        const response = await apiClient.post('/driver/deleteDriver', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
