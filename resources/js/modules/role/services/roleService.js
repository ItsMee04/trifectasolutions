// services/roleService.js
import apiClient from '../../../helper/apiClient';

export const roleService = {
    async getRoles() {
        const response = await apiClient.get('/role/getRole');
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeRoles(payload) {
        const response = await apiClient.post('/role/storeRole', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateRoles(payload) {
        const response = await apiClient.post('/role/updateRole', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteRoles(payload) {
        const response = await apiClient.post('/role/deleteRole', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
