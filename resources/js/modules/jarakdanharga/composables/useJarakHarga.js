import { ref, computed, reactive, watch } from 'vue';
import { jarakdanhargaService } from '../services/jarakdanhargaService';
import { notify } from '../../../helper/notification';
import Swal from 'sweetalert2';

// Shared State
const JarakHarga = ref([]);
const showSuggestionsPengambilan = ref(false);
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});
const columnFilters = reactive({
    kode: '',
    material: '',
    pengambilan: '',
    tujuan: '',
    jarak: '',
    hargaupah: '',
    hargajasa: '',
});


const formJarakDanHarga = reactive({
    id: null,
    pengambilan: '',
    tujuan: '',
    jarak: '',
    hargaupah: '',
    hargajasa: '',
    jenisKendaraan: '',
    kategoriMaterial: '',

    upahharian: '',
    jamkerja: '',
    jarakindexkm: '',
    hargasolar: '',
    indexsolarkm: '',
    tonase: '',
    upahharianinvoice: '',

    waktujarak: '',
    waktubongkarmuatmaterial: '',
    kebutuhanwaktujarakwaktubongkarmuat: '',
    perkiraanperolehanritase: '',
    pembulatan: '',


});

export function useJarakDanHarga() {

    const fetchJarakDanHarga = async () => {
        isLoading.value = true;

        try {
            const response = await jarakdanhargaService.getJarakDanHarga();
            JarakHarga.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Jarak & Harga:", error);
            JarakHarga.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (formJarakDanHarga.jarak === null || formJarakDanHarga.jarak === '') {
            errors.value.jarak = 'Jarak tidak boleh kosong.';
        } else if (String(formJarakDanHarga.jarak).includes(',')) {
            // Mengecek jika ada karakter koma
            errors.value.jarak = 'Gunakan titik (.) sebagai pemisah desimal, bukan koma.';
        } else if (isNaN(formJarakDanHarga.jarak)) {
            // Opsional: Memastikan input adalah angka valid
            errors.value.jarak = 'Jarak harus berupa angka valid.';
        }

        if (formJarakDanHarga.hargaupah === null || formJarakDanHarga.hargaupah === '') {
            errors.value.hargaupah = 'Harga Upah Driver Total tidak boleh kosong.';
        }

        if (formJarakDanHarga.hargajasa === null || formJarakDanHarga.hargajasa === '') {
            errors.value.hargajasa = 'Harga Jasa Angkut boleh kosong.';
        }

        if (formJarakDanHarga.hargasolar === null || formJarakDanHarga.hargasolar === '') {
            errors.value.hargasolar = 'Harga Jasa Angkut boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitJarakDanHarga = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formJarakDanHarga.id,
                pengambilan: formJarakDanHarga.pengambilan,
                tujuan: formJarakDanHarga.tujuan,
                jarak: formJarakDanHarga.jarak,
                hargaupah: formJarakDanHarga.hargaupah,
                hargajasa: formJarakDanHarga.hargajasa,
                hargasolar: formJarakDanHarga.hargasolar
            };

            let response;
            if (isEdit.value) {
                response = await jarakdanhargaService.updateJarakDanHarga(payload);
            } else {
                response = await jarakdanhargaService.storeJarakDanHarga(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalJarak');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchJarakDanHarga();
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

        // 1. ISI SYARAT KONDISI TERLEBIH DAHULU (PENTING)
        // Sesuaikan path 'item.source...' dengan response API asli Anda
        formJarakDanHarga.jenisKendaraan = item.source?.kendaraan?.jeniskendaraan?.jenis || '';
        formJarakDanHarga.kategoriMaterial = item.source?.material?.kategori?.kategori || '';

        // 2. ISI DATA FORM
        formJarakDanHarga.id = item.id;
        formJarakDanHarga.pengambilan = item.pengambilan;
        formJarakDanHarga.tujuan = item.tujuan;
        formJarakDanHarga.hargaupah = item.hargaupah;
        formJarakDanHarga.hargajasa = item.hargajasa;

        // 3. ISI DATA PERHITUNGAN
        formJarakDanHarga.jarak = item.jarak; // Nilai ini akan mentrigger watch pertama
        formJarakDanHarga.upahharian = item.upahharian || 0;
        formJarakDanHarga.jamkerja = item.jamkerja || 0;
        formJarakDanHarga.hargasolar = item.kegiatan_armada?.hargasolar || 0;
        formJarakDanHarga.jarakindexkm = 240;
        formJarakDanHarga.indexsolarkm = item.source?.kendaraan?.jeniskendaraan?.indexperkm || 0;
        formJarakDanHarga.tonase = item.source?.volume || 0;
        formJarakDanHarga.upahharianinvoice = item.upahharianinvoice || 0;

        formJarakDanHarga.waktujarak = item.waktujarak || 0;
        formJarakDanHarga.waktubongkarmuatmaterial = item.waktubongkarmuatmaterial || 0;
        formJarakDanHarga.pembulatan = item.pembulatan || 0;

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
    };

    const handleHitungUpahDriver = () => {
        // 1. Kita tidak butuh 'item' di sini karena data sudah ada di formJarakDanHarga
        // hasil dari fungsi handleEdit sebelumnya.

        isEdit.value = true;
        errors.value = {};

        // 2. Logika Perpindahan Modal
        const modalJarakEl = document.getElementById('modalJarak');
        const modalJarakInstance = bootstrap.Modal.getOrCreateInstance(modalJarakEl);

        const modalHitungEl = document.getElementById('modalHitungUpdahDriver');
        const modalHitungInstance = bootstrap.Modal.getOrCreateInstance(modalHitungEl);

        // Sembunyikan Modal Pertama, Tampilkan Modal Kedua
        modalJarakInstance.hide();
        modalHitungInstance.show();

        // 3. Listener untuk kembali ke Modal Pertama
        const handleHidden = () => {
            setTimeout(() => {
                modalJarakInstance.show();
            }, 150);
            modalHitungEl.removeEventListener('hidden.bs.modal', handleHidden);
        };

        modalHitungEl.addEventListener('hidden.bs.modal', handleHidden);
    };

    // 1. Hitung WAKTU JARAK = (Jarak * 2) / 30
    // KONDISI: Kendaraan DT DAN Material BUKAN ASPAL
    watch(() => formJarakDanHarga.jarak, (newJarak) => {
        const jarak = parseFloat(newJarak) || 0;

        // Normalisasi teks ke uppercase untuk menghindari kesalahan ketik (dt vs DT)
        const isDT = formJarakDanHarga.jenisKendaraan?.toUpperCase() === 'DT';
        const isNotAspal = formJarakDanHarga.kategoriMaterial?.toUpperCase() !== 'ASPAL';

        if (isDT && isNotAspal) {
            formJarakDanHarga.waktujarak = parseFloat(((jarak * 2) / 30).toFixed(2));
        } else {
            // Jika tidak memenuhi syarat, Anda bisa set ke 0 atau nilai default lainnya
            formJarakDanHarga.waktujarak = 0;
        }
    }, { immediate: true }); // Tambahkan immediate agar terhitung saat modal dibuka

    // 2. Hitung KEBUTUHAN WAKTU = Waktu Jarak + Waktu Bongkar Muat
    watch([
        () => formJarakDanHarga.waktujarak,
        () => formJarakDanHarga.waktubongkarmuatmaterial
    ], ([newWaktuJarak, newWaktuBongkar]) => {
        const wJarak = parseFloat(newWaktuJarak) || 0;
        const wBongkar = parseFloat(newWaktuBongkar) || 0;
        formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat = parseFloat((wJarak + wBongkar).toFixed(2));
    }, { immediate: true });

    // 3. Hitung PERKIRAAN RITASE = Jam Kerja / Kebutuhan Waktu
    watch([
        () => formJarakDanHarga.jamkerja,
        () => formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat
    ], ([newJamKerja, newKebutuhan]) => {
        const jam = parseFloat(newJamKerja) || 0;
        const kebutuhan = parseFloat(newKebutuhan) || 0;

        if (kebutuhan > 0) {
            formJarakDanHarga.perkiraanperolehanritase = parseFloat((jam / kebutuhan).toFixed(2));
        } else {
            formJarakDanHarga.perkiraanperolehanritase = 0;
        }
    }, { immediate: true });

    const handleRefresh = async () => {
        await fetchJarakDanHarga();
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
            String(item.kode || '').toLowerCase().includes(query) ||
            String(item.source?.material?.material || '').toLowerCase().includes(query) ||
            String(item.pengambilan || '').toLowerCase().includes(query) ||
            String(item.tujuan || '').toLowerCase().includes(query) ||
            String(item.jarak || '').toLowerCase().includes(query) ||
            String(item.hargaupah || '').toLowerCase().includes(query) ||
            String(item.hargajasa || '').toLowerCase().includes(query) ||
            String(item.hargasolar || '').toLowerCase().includes(query)
        );
    }

    // // --- FILTER UTAMA (Text + Date Range) ---
    // const filteredJarakDanHarga = computed(() => {
    //     const query = searchQuery.value.toLowerCase();

    //     return JarakHarga.value.filter(item => {
    //         const matchesSearch = searchMatch(item, query);

    //         let matchesDate = true;
    //         if (startDate.value && endDate.value) {
    //             matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
    //         } else if (startDate.value) {
    //             matchesDate = item.tanggal >= startDate.value;
    //         } else if (endDate.value) {
    //             matchesDate = item.tanggal <= endDate.value;
    //         }

    //         return matchesSearch && matchesDate;
    //     });
    // });

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredJarakDanHarga = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return JarakHarga.value.filter(item => {
            // 1. FILTER SEARCH GLOBAL (Cari di semua field)
            const matchesSearch = searchMatch(item, query);

            // 2. FILTER TANGGAL (Range)
            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

            // 3. FILTER PER KOLOM (Spesifik)
            // .every() memastikan SEMUA inputan kolom yang diisi harus terpenuhi
            const matchesColumns = Object.keys(columnFilters).every(key => {
                const filterVal = columnFilters[key].toLowerCase();
                if (!filterVal) return true; // Jika filter kosong, loloskan data

                switch (key) {
                    case 'kode':
                        return String(item.kode || '').toLowerCase().includes(filterVal);
                    case 'material':
                        return String(item?.source?.material.material || '').toLowerCase().includes(filterVal);
                    case 'pengambilan':
                        return String(item.pengambilan || '').toLowerCase().includes(filterVal);
                    case 'tujuan':
                        return String(item.tujuan || '').toLowerCase().includes(filterVal);
                    case 'jarak':
                        return String(item.jarak || '').toLowerCase().includes(filterVal);
                    case 'hargaupah':
                        return String(item.hargaupah || '').toLowerCase().includes(filterVal);
                    case 'hargajasa':
                        return String(item.hargajasa || '').toLowerCase().includes(filterVal);
                    // ... case kolom lainnya
                    default: return true;
                }
            });

            // KEMBALIKAN DATA HANYA JIKA SEMUA KONDISI TRUE
            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        return filteredJarakDanHarga.value.reduce((acc, item) => {
            acc.jarakTotal += parseFloat(item.jarak || 0);
            acc.upahTotal += Number(item.hargaupah || 0);
            acc.jasaTotal += Number(item.hargajasa || 0);
            acc.hargasolarTotal += Number(item.hargasolar || 0);
            return acc;
        }, { jarakTotal: 0, upahTotal: 0, jasaTotal: 0, hargasolarTotal: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredJarakDanHarga.value.length / itemsPerPage) || 1;
    });

    const paginatedJarakDanHarga = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredJarakDanHarga.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    // Tambahkan reset filter kolom
    const resetColumnFilters = () => {
        Object.keys(columnFilters).forEach(key => columnFilters[key] = '');
    };

    // Computed untuk memfilter supplier berdasarkan input "Pengambilan"
    const filteredSupplierSuggestions = computed(() => {
        const query = formJarakDanHarga.pengambilan.toLowerCase();
        if (!query) return [];

        return supplierList.value
            .filter(sup => sup.nama.toLowerCase().includes(query))
            .map(sup => sup.nama); // Ambil namanya saja
    });

    const selectPengambilan = (nama) => {
        formJarakDanHarga.pengambilan = nama;
        showSuggestionsPengambilan.value = false;
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
        JarakHarga,
        isLoading,
        searchQuery,
        currentPage,
        startDate,
        endDate,
        isEdit,
        formJarakDanHarga,
        errors,
        displayedPages,
        totalPages,
        totalFooter,
        formatNumber,
        filteredJarakDanHarga,
        paginatedJarakDanHarga,
        showSuggestionsPengambilan,
        filteredSupplierSuggestions,
        selectPengambilan,
        fetchJarakDanHarga,
        handleEdit,
        handleHitungUpahDriver,
        handleRefresh,
        submitJarakDanHarga,
        resetDateFilter,
        columnFilters,
        resetColumnFilters,
    };
}
