// services/Materialervice.js
import apiClient from '../../../helper/apiClient';

export const materialService = {
    async getMaterial() {
        const response = await apiClient.get('/material/getMaterial');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeMaterial(payload) {
        const response = await apiClient.post('/material/storeMaterial', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateMaterial(payload) {
        const response = await apiClient.post('/material/updateMaterial', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteMaterial(payload) {
        const response = await apiClient.post('/material/deleteMaterial', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
