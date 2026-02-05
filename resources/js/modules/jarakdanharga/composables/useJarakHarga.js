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
    satuanMaterial:'',
    volume: '',

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

    solarjarak: '',
    upahhariandriver: '',
    upahdriver: '',
    upahpermaterial: ''


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
            // Gabungkan data form utama dengan hasil kalkulasi dari watch
            const payload = {
                id: formJarakDanHarga.id,

                // Field dari perhitungan otomatis (Watch)
                upahdriver: formJarakDanHarga.upahdriver,
                upahpermaterial: formJarakDanHarga.upahpermaterial,
                hargasolar: formJarakDanHarga.hargasolar,
                solarjarak: formJarakDanHarga.solarjarak,
            };

            let response;
            if (isEdit.value) {
                response = await jarakdanhargaService.updateJarakDanHarga(payload);
            } else {
                response = await jarakdanhargaService.storeJarakDanHarga(payload);
            }

            notify.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalJarak');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchJarakDanHarga();
            return true;
        } catch (error) {
            // ... handling error tetap sama ...
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
        formJarakDanHarga.satuanMaterial = item.source?.material?.satuan || '';

        // 2. ISI DATA FORM
        formJarakDanHarga.id = item.id;
        formJarakDanHarga.pengambilan = item.pengambilan;
        formJarakDanHarga.tujuan = item.tujuan;
        formJarakDanHarga.hargaupah = item.hargaupah;
        formJarakDanHarga.hargajasa = item.hargajasa;

        // Sesuai JSON yang Anda berikan: item.source.volume
        formJarakDanHarga.volume = item.source?.volume || 0;

        // 3. ISI DATA PERHITUNGAN
        formJarakDanHarga.jarak = item.jarak; // Nilai ini akan mentrigger watch pertama
        formJarakDanHarga.upahharian = 200000;
        formJarakDanHarga.jamkerja = 8;
        formJarakDanHarga.hargasolar = 6800;
        formJarakDanHarga.jarakindexkm = 240;
        formJarakDanHarga.indexsolarkm = item.source?.kendaraan?.jeniskendaraan?.indexperkm || 0;
        formJarakDanHarga.tonase = 1;
        formJarakDanHarga.upahharianinvoice = 400000;

        formJarakDanHarga.waktujarak = item.waktujarak || 0;
        formJarakDanHarga.waktubongkarmuatmaterial = 0.3;
        formJarakDanHarga.pembulatan = 5;

        formJarakDanHarga.upahhariandriver = item.upahhariandriver || 0;
        formJarakDanHarga.upahdriver = item.upahdriver || 0;
        formJarakDanHarga.upahpermaterial = item.upahpermaterial || 0;

        hitungOtomatis();

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
    };

    const hitungOtomatis = () => {
        watch([
            () => formJarakDanHarga.jarak,
            () => formJarakDanHarga.jamkerja,
            () => formJarakDanHarga.waktubongkarmuatmaterial,
            () => formJarakDanHarga.jenisKendaraan,
            () => formJarakDanHarga.kategoriMaterial,
            () => formJarakDanHarga.indexsolarkm,
            () => formJarakDanHarga.hargasolar,
            () => formJarakDanHarga.upahharian,
            () => formJarakDanHarga.upahharianinvoice,
            () => formJarakDanHarga.pembulatan,
            () => formJarakDanHarga.tonase
        ], () => {
            const jarak = parseFloat(formJarakDanHarga.jarak) || 0;
            const jam = parseFloat(formJarakDanHarga.jamkerja) || 0;
            const indexSolar = parseFloat(formJarakDanHarga.indexsolarkm) || 0;
            const hargaSolar = parseFloat(formJarakDanHarga.hargasolar) || 0;
            const upahHarian = parseFloat(formJarakDanHarga.upahharian) || 0;
            const upahHarianInvoice = parseFloat(formJarakDanHarga.upahharianinvoice) || 0;
            const pembulatan = parseFloat(formJarakDanHarga.pembulatan) || 0;
            const tonase = parseFloat(formJarakDanHarga.tonase) || 0;

            const kategori = formJarakDanHarga.kategoriMaterial?.toUpperCase();
            const kendaraan = formJarakDanHarga.jenisKendaraan?.toUpperCase();

            let resWaktuJarak = 0;
            let resRitase = 0;
            let resSolarJarak = 0;
            let resUpahHarianDriver = 0;
            let resUpahDriver = 0;
            let resUpahPerMaterial = 0;

            // =========================================================================
            // 1. SET PARAMETER KHUSUS ASPAL
            // =========================================================================
            if (kategori === 'ASPAL' && kendaraan === 'DT') {
                formJarakDanHarga.upahharianinvoice = 500000;
                formJarakDanHarga.waktubongkarmuatmaterial = 2;
                formJarakDanHarga.pembulatan = 1;
                if (formJarakDanHarga.volume) {
                    formJarakDanHarga.tonase = parseFloat(formJarakDanHarga.volume) || 0;
                }
            }

            const wBongkarAktif = parseFloat(formJarakDanHarga.waktubongkarmuatmaterial) || 0;
            const tonaseAktif = parseFloat(formJarakDanHarga.tonase) || 0;

            // =========================================================================
            // 2. LOGIKA PERHITUNGAN (DT)
            // =========================================================================
            if (kendaraan === 'DT') {
                resWaktuJarak = (jarak * 2) / 30;

                const rawKebutuhan = resWaktuJarak + wBongkarAktif;
                if (rawKebutuhan > 0) {
                    resRitase = jam / rawKebutuhan;
                }

                if (indexSolar > 0) {
                    resSolarJarak = ((jarak * 2) / indexSolar) * hargaSolar;
                }

                if (resRitase > 0) {
                    resUpahHarianDriver = upahHarian / resRitase;
                }

                // --- PERBEDAAN RUMUS UPAH DRIVER ---
                const rawTotalUpahDriver = resSolarJarak + resUpahHarianDriver;

                if (kategori === 'ASPAL') {
                    // Rumus ASPAL: (Solar + Upah Harian) / Tonase
                    resUpahDriver = tonaseAktif > 0 ? (rawTotalUpahDriver / tonaseAktif) : 0;
                } else {
                    // Rumus Normal: Solar + Upah Harian
                    resUpahDriver = rawTotalUpahDriver;
                }

                // --- PERBEDAAN RUMUS UPAH PER MATERIAL ---
                if (tonaseAktif > 0 && pembulatan > 0) {
                    if (kategori === 'ASPAL') {
                        // Rumus ASPAL: ((Invoice / Pembulatan) / Tonase) + UpahDriver (yang sudah dibagi tonase)
                        const bagian1 = (upahHarianInvoice / pembulatan) / tonaseAktif;
                        resUpahPerMaterial = bagian1 + resUpahDriver;
                    } else {
                        // Rumus Normal: ((Invoice / Pembulatan) / Tonase) + (UpahDriver / Tonase)
                        const bagian1 = (upahHarianInvoice / pembulatan) / tonaseAktif;
                        const bagian2 = resUpahDriver / tonaseAktif;
                        resUpahPerMaterial = bagian1 + bagian2;
                    }
                }
            }

            // =========================================================================
            // 3. FINALISASI KE STATE
            // =========================================================================
            formJarakDanHarga.waktujarak = parseFloat(resWaktuJarak.toFixed(3));
            formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat = parseFloat((resWaktuJarak + wBongkarAktif).toFixed(3));
            formJarakDanHarga.perkiraanperolehanritase = parseFloat(resRitase.toFixed(2));
            formJarakDanHarga.solarjarak = Math.round(resSolarJarak);
            formJarakDanHarga.upahhariandriver = Math.round(resUpahHarianDriver);

            // Simpan hasil sesuai kondisi (ASPAL menggunakan desimal karena hasil bagi)
            formJarakDanHarga.upahdriver = kategori === 'ASPAL' ? parseFloat(resUpahDriver.toFixed(0)) : Math.round(resUpahDriver);
            formJarakDanHarga.upahpermaterial = parseFloat(resUpahPerMaterial.toFixed(0));

        }, { immediate: true });
    };

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
        handleRefresh,
        submitJarakDanHarga,
        resetDateFilter,
        columnFilters,
        resetColumnFilters,
    };
}
