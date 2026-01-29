// services/invoiceService.js
import apiClient from '../../../helper/apiClient';

export const invoiceService = {
    async getInvoice(payload) {
        const response = await apiClient.post('/invoice/getInvoice', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async storeInvoice(payload) {
        const response = await apiClient.post('/invoice/storeInvoice', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async updateInvoice(payload) {
        const response = await apiClient.post('/invoice/updateInvoice', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    },

    async deleteInvoice(payload) {
        const response = await apiClient.post('/invoice/deleteInvoice', payload);
        return response.data; // Sesuaikan dengan struktur JSON Laravel Anda
    }
};
