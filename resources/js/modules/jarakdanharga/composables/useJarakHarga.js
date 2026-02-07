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
    satuanMaterial: '',
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
    waktubongkar: '',
    kebutuhanwaktujarakwaktubongkarmuat: '',
    perkiraanperolehanritase: '',
    pembulatan: '',

    solarjarak: '',
    upahhariandriver: '',
    upahdriver: '',
    upahpermaterial: '',

    //DTT
    upahharian2: '',
    upahharianinvoice2: '',
    kecepatanratarataberangkat: '',
    kecepatanrataratakembali: '',
    waktumuat: '',
    waktuyangdiperlukanberangkat: '',
    waktuyangdiperlukankembali: '',
    jumlahwaktuyangdiperlukan: '',
    perkiraanperolehanritase2: '',
    pembulatan2: '',
    tonase2: ''

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

    // const submitJarakDanHarga = async () => {
    //     if (!validateForm()) return false;
    //     isLoading.value = true;
    //     try {
    //         // Gabungkan data form utama dengan hasil kalkulasi dari watch
    //         const payload = {
    //             id: formJarakDanHarga.id,

    //             // Field dari perhitungan otomatis (Watch)
    //             upahdriver: formJarakDanHarga.upahdriver,
    //             upahpermaterial: formJarakDanHarga.upahpermaterial,
    //             hargasolar: formJarakDanHarga.hargasolar,
    //             solarjarak: formJarakDanHarga.solarjarak,
    //         };

    //         let response;
    //         if (isEdit.value) {
    //             response = await jarakdanhargaService.updateJarakDanHarga(payload);
    //         } else {
    //             response = await jarakdanhargaService.storeJarakDanHarga(payload);
    //         }

    //         notify.success(response.message || 'Data berhasil disimpan');

    //         // Tutup Modal
    //         const modalElement = document.getElementById('modalJarak');
    //         const modalInstance = bootstrap.Modal.getInstance(modalElement);
    //         if (modalInstance) modalInstance.hide();

    //         await fetchJarakDanHarga();
    //         return true;
    //     } catch (error) {
    //         // ... handling error tetap sama ...
    //     } finally {
    //         isLoading.value = false;
    //     }
    // };

    const submitJarakDanHarga = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const kategori = formJarakDanHarga.kategoriMaterial?.toUpperCase();
            const kendaraan = formJarakDanHarga.jenisKendaraan?.toUpperCase();

            let payload = {
                id: formJarakDanHarga.id,
                // Field dasar yang selalu ada
                jarak: formJarakDanHarga.jarak,
                hargasolar: formJarakDanHarga.hargasolar,
                solarjarak: formJarakDanHarga.solarjarak,
            };

            // KONDISI A: Bukan Aspal & DT
            if (kategori !== 'ASPAL' && kendaraan === 'DT') {
                payload = {
                    ...payload,
                    upahdriver: formJarakDanHarga.upahdriver,
                    upahpermaterial: formJarakDanHarga.upahpermaterial,
                    tonase: formJarakDanHarga.tonase,
                    upahharian: formJarakDanHarga.upahharian,
                    upahharianinvoice: formJarakDanHarga.upahharianinvoice,
                    pembulatan: formJarakDanHarga.pembulatan
                };
            }
            // KONDISI B: Aspal & DT
            else if (kategori === 'ASPAL' && kendaraan === 'DT') {
                payload = {
                    ...payload,
                    upahdriver: formJarakDanHarga.upahdriver,
                    upahpermaterial: formJarakDanHarga.upahpermaterial,
                    volume: formJarakDanHarga.volume, // Biasanya aspal pakai volume/m3
                    upahharianinvoice: 500000, // Hardcoded sesuai logika hitungOtomatis Anda
                    waktubongkarmuatmaterial: 2
                };
            }
            // KONDISI C: Bukan Aspal & DTT
            else if (kategori !== 'ASPAL' && kendaraan === 'DTT') {
                payload = {
                    ...payload,
                    upahdriver: formJarakDanHarga.upahdriver,
                    upahpermaterial: formJarakDanHarga.upahpermaterial,
                    tonase2: formJarakDanHarga.tonase2,
                    upahharian2: formJarakDanHarga.upahharian2,
                    upahharianinvoice2: formJarakDanHarga.upahharianinvoice2,
                    pembulatan2: formJarakDanHarga.pembulatan2,
                    jumlahwaktuyangdiperlukan: formJarakDanHarga.jumlahwaktuyangdiperlukan,
                    perkiraanperolehanritase2: formJarakDanHarga.perkiraanperolehanritase2
                };
            }

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
            console.error("Submission error:", error);
            notify.error(error.response?.data?.message || 'Gagal menyimpan data');
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

        //DTT
        formJarakDanHarga.kecepatanratarataberangkat = 30;
        formJarakDanHarga.kecepatanrataratakembali = 35;
        formJarakDanHarga.waktumuat = 0;
        formJarakDanHarga.waktubongkar = 0;
        formJarakDanHarga.waktuyangdiperlukanberangkat = 0;
        formJarakDanHarga.waktuyangdiperlukankembali = 0;

        hitungOtomatis();

        const modal = new bootstrap.Modal(document.getElementById('modalJarak'));
        modal.show();
    };

    const hitungOtomatis = () => {
        watch([
            () => formJarakDanHarga.jarak,
            () => formJarakDanHarga.waktumuat, // Input manual baru
            () => formJarakDanHarga.waktubongkar, // TAMBAHKAN INI
            () => formJarakDanHarga.waktujarak,
            () => formJarakDanHarga.perkiraanperolehanritase2,
            () => formJarakDanHarga.pembulatan2,
            () => formJarakDanHarga.kecepatanratarataberangkat, // Tambahan
            () => formJarakDanHarga.kecepatanrataratakembali,  // Tambahan
            () => formJarakDanHarga.jamkerja,
            () => formJarakDanHarga.waktubongkarmuatmaterial,
            () => formJarakDanHarga.jenisKendaraan,
            () => formJarakDanHarga.kategoriMaterial,
            () => formJarakDanHarga.indexsolarkm,
            () => formJarakDanHarga.hargasolar,
            () => formJarakDanHarga.upahharian,
            () => formJarakDanHarga.upahharianinvoice,
            () => formJarakDanHarga.pembulatan,
            () => formJarakDanHarga.tonase,
            () => formJarakDanHarga.volume
        ], () => {
            // 1. Inisialisasi Data Dasar
            const jarak = parseFloat(formJarakDanHarga.jarak) || 0;
            const jam = parseFloat(formJarakDanHarga.jamkerja) || 0;
            const indexSolar = parseFloat(formJarakDanHarga.indexsolarkm) || 0;
            const hargaSolar = parseFloat(formJarakDanHarga.hargasolar) || 0;
            const upahHarian = parseFloat(formJarakDanHarga.upahharian) || 0;
            const upahHarianInvoice = parseFloat(formJarakDanHarga.upahharianinvoice) || 0;
            const pembulatan = parseFloat(formJarakDanHarga.pembulatan) || 0;
            const vBerangkat = parseFloat(formJarakDanHarga.kecepatanratarataberangkat) || 0;
            const vKembali = parseFloat(formJarakDanHarga.kecepatanrataratakembali) || 0;
            const wMuat = parseFloat(formJarakDanHarga.waktumuat) || 0;
            const wBongkar = parseFloat(formJarakDanHarga.waktubongkarmuatmaterial) || 0;
            const wBongkarManual = parseFloat(formJarakDanHarga.waktubongkar) || 0;
            const ritase2 = parseFloat(formJarakDanHarga.perkiraanperolehanritase2) || 0;
            const pembulatan2 = parseFloat(formJarakDanHarga.pembulatan2) || 0;
            const waktujarak = parseFloat(formJarakDanHarga.waktujarak) || 0;

            const kategori = formJarakDanHarga.kategoriMaterial?.toUpperCase();
            const kendaraan = formJarakDanHarga.jenisKendaraan?.toUpperCase();

            // Variabel penampung hasil
            let resWaktuJarak = 0;
            let resRitase = 0;
            let resSolarJarak = 0;
            let resUpahHarianDriver = 0;
            let resUpahDriver = 0;
            let resUpahPerMaterial = 0;
            let wBongkarAktif = parseFloat(formJarakDanHarga.waktubongkarmuatmaterial) || 0;
            let tonaseAktif = parseFloat(formJarakDanHarga.tonase) || 0;

            // =========================================================================
            // PEMBAGIAN KONDISI
            // =========================================================================

            if (kategori !== 'ASPAL' && kendaraan === 'DT') {
                console.log("Kondisi 1: Bukan Aspal & DT");
                // Logika DT Normal
                resWaktuJarak = (jarak * 2) / 30;
                resRitase = (resWaktuJarak + wBongkarAktif) > 0 ? jam / (resWaktuJarak + wBongkarAktif) : 0;
                resSolarJarak = indexSolar > 0 ? ((jarak * 2) / indexSolar) * hargaSolar : 0;
                resUpahHarianDriver = resRitase > 0 ? upahHarian / resRitase : 0;

                resUpahDriver = resSolarJarak + resUpahHarianDriver;
                resUpahPerMaterial = (tonaseAktif > 0 && pembulatan > 0)
                    ? ((upahHarianInvoice / pembulatan) / tonaseAktif) + (resUpahDriver / tonaseAktif)
                    : 0;

            } else if (kategori === 'ASPAL' && kendaraan === 'DT') {
                console.log("Kondisi 2: Aspal & DT");
                // Set Parameter Khusus Aspal
                formJarakDanHarga.upahharianinvoice = 500000;
                formJarakDanHarga.waktubongkarmuatmaterial = 2;
                formJarakDanHarga.pembulatan = 1;
                tonaseAktif = parseFloat(formJarakDanHarga.volume) || 0;
                formJarakDanHarga.tonase = tonaseAktif;
                wBongkarAktif = 2;

                resWaktuJarak = (jarak * 2) / 30;
                resRitase = (resWaktuJarak + wBongkarAktif) > 0 ? jam / (resWaktuJarak + wBongkarAktif) : 0;
                resSolarJarak = indexSolar > 0 ? ((jarak * 2) / indexSolar) * hargaSolar : 0;
                resUpahHarianDriver = resRitase > 0 ? upahHarian / resRitase : 0;

                resUpahDriver = tonaseAktif > 0 ? (resSolarJarak + resUpahHarianDriver) / tonaseAktif : 0;
                resUpahPerMaterial = (tonaseAktif > 0)
                    ? ((500000 / 1) / tonaseAktif) + resUpahDriver
                    : 0;

            } else if (kategori !== 'ASPAL' && kendaraan === 'DTT') {
                console.log("Kondisi 3: Bukan Aspal & DTT");

                formJarakDanHarga.upahharianinvoice = 500000;
                formJarakDanHarga.upahharian2 = 250000;
                formJarakDanHarga.upahharianinvoice2 = 1500000;
                formJarakDanHarga.tonase2 = 20;

                // 1. Waktu Jarak (Indeks)
                const jarakIndexKM = parseFloat(formJarakDanHarga.jarakindexkm) || 240;
                resWaktuJarak = ((jarak * 2) * jam) / jarakIndexKM;

                // 2. Kebutuhan Waktu (Waktu Jarak + Input Manual)
                const totalKebutuhanWaktu = resWaktuJarak + wBongkar;
                formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat = parseFloat(totalKebutuhanWaktu.toFixed(3));

                // 3. Ritase Utama & Pembulatan Utama (pembulatan)
                resRitase = totalKebutuhanWaktu > 0 ? jam / totalKebutuhanWaktu : 0;
                const pembulatanUtama = Math.round(resRitase);
                formJarakDanHarga.pembulatan = pembulatanUtama;

                // 4. Solar Jarak
                resSolarJarak = indexSolar > 0 ? ((jarak * 2) / indexSolar) * hargaSolar : 0;

                // 5. Waktu Perjalanan Real
                const waktuBerangkat = vBerangkat > 0 ? jarak / vBerangkat : 0;
                const waktuKembali = vKembali > 0 ? jarak / vKembali : 0;
                formJarakDanHarga.waktuyangdiperlukanberangkat = parseFloat(waktuBerangkat.toFixed(3));
                formJarakDanHarga.waktuyangdiperlukankembali = parseFloat(waktuKembali.toFixed(3));

                // 6. Akumulasi SUM Waktu Real (jumlahwaktuyangdiperlukan)
                const totalWaktuReal = wMuat + wBongkarManual + waktuBerangkat + waktuKembali;
                formJarakDanHarga.jumlahwaktuyangdiperlukan = parseFloat(totalWaktuReal.toFixed(3));

                // 7. Upah Harian Driver & Upah Driver
                resUpahHarianDriver = jam > 0 ? (totalWaktuReal / jam) * upahHarian : 0;
                resUpahDriver = resSolarJarak + resUpahHarianDriver;

                // --- PERBAIKAN RUMUS FINAL UPAH PER MATERIAL ---
                // Rumus: ((Invoice2 / Pembulatan) / Tonase) + (Upah Driver / Tonase)
                const tonaseAktif2 = parseFloat(formJarakDanHarga.tonase2) || 20;
                resUpahPerMaterial = (tonaseAktif2 > 0 && resRitase > 0)
                    ? ((1500000 / resRitase) / tonaseAktif2) + (resUpahDriver / tonaseAktif2)
                    : 0;
                // -----------------------------------------------

                // 9. Ritase 2 & Pembulatan 2
                const perkiraanritase2 = totalWaktuReal > 0 ? jam / totalWaktuReal : 0;
                formJarakDanHarga.perkiraanperolehanritase2 = parseFloat(perkiraanritase2.toFixed(2));
                formJarakDanHarga.pembulatan2 = Math.round(perkiraanritase2);
            } else if (kategori === 'ASPAL' && kendaraan === 'DTT') {
                console.log("Kondisi 4: Aspal & DTT");
                // TODO: Masukkan rumus spesifik DTT Aspal di sini

            } else if (kendaraan === 'SL') {
                console.log("Kondisi 5: Kendaraan SL");
                // TODO: Masukkan rumus spesifik SL di sini

            }

            // =========================================================================
            // FINALISASI KE STATE (Satu pintu di akhir)
            // =========================================================================
            formJarakDanHarga.waktujarak = parseFloat(resWaktuJarak.toFixed(3));
            formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat = parseFloat((resWaktuJarak + wBongkarAktif).toFixed(3));
            formJarakDanHarga.perkiraanperolehanritase = parseFloat(resRitase.toFixed(1));
            formJarakDanHarga.solarjarak = Math.round(resSolarJarak);
            formJarakDanHarga.upahhariandriver = Math.round(resUpahHarianDriver);

            // ASPAL biasanya butuh presisi desimal jika sudah dibagi tonase
            formJarakDanHarga.upahdriver = kategori === 'ASPAL' ? parseFloat(resUpahDriver.toFixed(2)) : Math.round(resUpahDriver);
            formJarakDanHarga.upahpermaterial = Math.round(resUpahPerMaterial);

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
