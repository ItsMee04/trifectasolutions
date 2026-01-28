// services/asphaltmixingplantService.js
import apiClient from '../../../helper/apiClient';

export const asphaltmixingplantService = {
    async getAsphaltMixingPlant(payload) {
        const response = await apiClient.post('/asphaltmixingplant/getAsphaltMixingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeAsphaltMixingPlant(payload) {
        const response = await apiClient.post('/asphaltmixingplant/storeAsphaltMixingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateAsphaltMixingPlant(payload) {
        const response = await apiClient.post('/asphaltmixingplant/updateAsphaltMixingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteAsphaltMixingPlant(payload) {
        const response = await apiClient.post('/asphaltmixingplant/deleteAsphaltMixingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
