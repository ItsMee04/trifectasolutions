import { ref, computed, reactive } from 'vue';
import { kegiatanarmadaService } from '../services/kegiatanarmadaService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const KegiatanArmadas = ref([]);
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const formKegiatanArmada = reactive({
    id: null,
    kendaraan_id: null,
    driver_id: null,
    rit: '',
    satuan: '',
    volume: '',
    upahhariankenet: '',
    umluarkotatelahterbayar: '',
    umpengajuan: '',
    insentifataulembur: ''
});

export function useKegiatanArmada() {

    const fetchKegiatanArmada = async () => {
        isLoading.value = true;

        try {
            const response = await kegiatanarmadaService.getKegiatanArmada();
            KegiatanArmadas.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Kegiatan Armada:", error);
            KegiatanArmadas.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (formKegiatanArmada.rit === null || formKegiatanArmada.rit === '') {
            errors.value.rit = 'RIT tidak boleh kosong.';
        }

        if (!formKegiatanArmada.satuan || formKegiatanArmada.satuan.trim() === '') {
            errors.value.satuan = 'Satuan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitKegiatanArmada = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formKegiatanArmada.id,
                rit: formKegiatanArmada.rit,
                satuan: formKegiatanArmada.satuan,
                upahhariankenet: formKegiatanArmada.upahhariankenet,
                umluarkotatelahterbayar: formKegiatanArmada.umluarkotatelahterbayar,
                umpengajuan: formKegiatanArmada.umpengajuan,
                insentifataulembur: formKegiatanArmada.insentifataulembur
            };

            let response;
            if (isEdit.value) {
                response = await kegiatanarmadaService.updateKegiatanArmada(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalKegiatanArmada');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchKegiatanArmada();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                notify.error(error.response.data.message || 'Terjadi kesalahan validasi.');
            } else {
                notify.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formKegiatanArmada.id = item.id;
        formKegiatanArmada.rit = item.rit;
        formKegiatanArmada.satuan = item.satuan;
        formKegiatanArmada.upahhariankenet = item.upahhariankenet;
        formKegiatanArmada.umluarkotatelahterbayar = item.umluarkotatelahterbayar;
        formKegiatanArmada.umpengajuan = item.umpengajuan;
        formKegiatanArmada.insentifataulembur = item.insentifataulembur;

        const modal = new bootstrap.Modal(document.getElementById('modalKegiatanArmada'));
        modal.show();
    };

    const handleRefresh = async () => {
        await fetchKegiatanArmada();
    }

    const formatNumber = (value, decimals = 0) => {
        if (value === null || value === undefined || value === '') return "0";
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };

    // --- HELPER UNTUK SEARCH MATCH ---
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
            String(item.upahhariankenet || '').toLowerCase().includes(query) ||
            String(item.umluarkotatelahterbayar || '').toLowerCase().includes(query) ||
            String(item.umpengajuan || '').toLowerCase().includes(query) ||
            String(item.insentifataulembur || '').toLowerCase().includes(query) ||
            String(item.upah || '').toLowerCase().includes(query) ||
            String(item.jumlah || '').toLowerCase().includes(query) ||
            String(item.penjualan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredKegiatanArmada = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return KegiatanArmadas.value.filter(item => {
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
        return filteredKegiatanArmada.value.reduce((acc, item) => {
            acc.jarakTotal += Number(item.jarak?.jarak || 0);
            acc.hargaTotal += Number(item.jarak?.hargaupah || 0);
            acc.ritTotal += Number(item.rit || 0);
            acc.volumeTotal += Number(item.jarak?.source.volume || 0);
            acc.upahkenetTotal += Number(item.upahhariankenet || 0);
            acc.umluarkotatelahterbayarTotal += Number(item.umluarkotatelahterbayar || 0);
            acc.umpengajuanTotal += Number(item.umpengajuan || 0);
            acc.insentifataulemburTotal += Number(item.insentifataulembur || 0);
            acc.upahTotal += Number(item.upah || 0);
            acc.jumlahTotal += Number(item.jumlah || 0);
            acc.penjualanTotal += Number(item.penjualan || 0);
            acc.hargasolarTotal += Number(item.hargasolar || 0);
            acc.nominalbiayasolarTotal += Number(item.nominalbiayasolar || 0);
            return acc;
        }, {
            jarakTotal: 0,
            hargaTotal: 0,
            ritTotal: 0,
            volumeTotal: 0,
            upahkenetTotal: 0,
            umluarkotatelahterbayarTotal: 0,
            umpengajuanTotal: 0,
            insentifataulemburTotal: 0,
            upahTotal: 0,
            jumlahTotal: 0,
            penjualanTotal: 0,
            hargasolarTotal: 0,
            nominalbiayasolarTotal: 0,
        });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredKegiatanArmada.value.length / itemsPerPage) || 1;
    });

    const paginatedKegiatanArmada = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredKegiatanArmada.value.slice(start, start + itemsPerPage);
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

    return {
        KegiatanArmadas, isLoading, searchQuery, currentPage, startDate, endDate, isEdit, formKegiatanArmada,
        errors, displayedPages,
        totalPages,
        totalFooter,
        formatNumber,
        filteredKegiatanArmada,
        paginatedKegiatanArmada,
        fetchKegiatanArmada, handleEdit, handleRefresh, submitKegiatanArmada, resetDateFilter
    };
}
