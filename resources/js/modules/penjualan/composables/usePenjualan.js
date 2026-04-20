import { ref, computed, reactive } from 'vue'
import { penjualanService } from '../services/penjualanService'
import { notify } from '../../../helper/notification'
import Swal from 'sweetalert2'

// Shared State
const Penjualans = ref([])
const startDate = ref('')
const endDate = ref('')
const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isEdit = ref(false)
const errors = ref({})


export function usePenjualan() {

    const fetchPenjualan = async () => {
        isLoading.value = true

        try {
            const response = await penjualanService.getPenjualan()
            Penjualans.value = Array.isArray(response) ? response : (response.data || [])
        } catch (error) {
            console.error("Gagal mengambil data Penjualan:", error)
            Penjualans.value = []
        } finally {
            isLoading.value = false
        }
    }

    const searchMatch = (item, query) => {
        return (
            String(item.jarak?.jarak || '').toLowerCase().includes(query) ||
            String(item.jarak?.hargaupah || '').toLowerCase().includes(query) ||
            String(item.jarak?.source?.material.material || '').toLowerCase().includes(query) ||
            String(item.tanggal || '').toLowerCase().includes(query) ||
            String(item.jarak?.source?.kendaraan?.kode || '').toLowerCase().includes(query) ||
            String(item.jarak?.source?.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.rit || '').toLowerCase().includes(query) ||
            String(item.satuan || '').toLowerCase().includes(query) ||
            String(item.volume || '').toLowerCase().includes(query) ||
            String(item.jarak?.pengambilan || '').toLowerCase().includes(query) ||
            String(item.jarak?.tujuan || '').toLowerCase().includes(query) ||
            String(item.penjualan || '').toLowerCase().includes(query)
        );
    }

    const filteredPenjualans = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return Penjualans.value.filter(item => {
            const matchesSearch = searchMatch(item, query);

            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

            return matchesSearch && matchesDate;
        });
    });

    const totalFooter = computed(() => {
        return filteredPenjualans.value.reduce((acc, item) => {
            acc.jarakTotal += Number(item.jarak?.jarak || 0);
            acc.hargaTotal += Number(item.jarak?.hargajasa || 0);
            acc.ritTotal += Number(item.rit || 0);
            acc.volumeTotal += Number(item.jarak?.source.volume || 0);
            acc.penjualanTotal += Number(item.penjualan || 0);
            return acc;
        }, {
            jarakTotal: 0,
            hargaTotal: 0,
            ritTotal: 0,
            volumeTotal: 0,
            penjualanTotal: 0,
        });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredPenjualans.value.length / itemsPerPage) || 1;
    });

    const paginatedPenjualans = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredPenjualans.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    const displayedPages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 5; // Jumlah nomor yang ingin ditampilkan

        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    const formatNumber = (value, decimals = 0) => {
        if (value === null || value === undefined || value === '') return "0";
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };

    return {
        Penjualans,
        isLoading,
        searchQuery,
        currentPage,
        startDate,
        endDate,
        itemsPerPage,
        isEdit,
        errors,
        fetchPenjualan,
        filteredPenjualans,
        totalFooter,
        totalPages,
        paginatedPenjualans,
        resetDateFilter,
        displayedPages,
        formatNumber,
    }
}
