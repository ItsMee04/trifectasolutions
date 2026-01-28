// services/concretebatchingplantService.js
import apiClient from '../../../helper/apiClient';

export const concretebatchingplantService = {
    async getConcreteBatchingPlant(payload) {
        const response = await apiClient.post('/concretebatchingplant/getConcreteBatchingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeConcreteBatchingPlant(payload) {
        const response = await apiClient.post('/concretebatchingplant/storeConcreteBatchingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateConcreteBatchingPlant(payload) {
        const response = await apiClient.post('/concretebatchingplant/updateConcreteBatchingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteConcreteBatchingPlant(payload) {
        const response = await apiClient.post('/concretebatchingplant/deleteConcreteBatchingPlant', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
