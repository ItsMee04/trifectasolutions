<template>
    <div class="modal fade" id="modalFilterInvoice" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        FILTER INVOICE
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3 position-relative">
                                    <label>Pengambilan <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.pengambilan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.pengambilan }" @input="showSuggestions = true"
                                        @focus="showSuggestions = true" autocomplete="off">

                                    <ul v-if="showSuggestions && suggestionPengambilan.length > 0"
                                        class="list-group position-absolute w-100 shadow-sm"
                                        style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                                        <li v-for="(nama, index) in suggestionPengambilan" :key="index"
                                            class="list-group-item list-group-item-action" style="cursor: pointer;"
                                            @click="selectPengambilan(nama)">
                                            {{ nama }}
                                        </li>
                                    </ul>

                                    <div class="invalid-feedback" v-if="errors.pengambilan">
                                        {{ Array.isArray(errors.pengambilan) ? errors.pengambilan[0] :
                                            errors.pengambilan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3 position-relative">
                                    <label>Tujuan <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.tujuan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.tujuan }" @input="showSuggestionsTujuan = true"
                                        @focus="showSuggestionsTujuan = true" autocomplete="off">

                                    <ul v-if="showSuggestionsTujuan && suggestionTujuan.length > 0"
                                        class="list-group position-absolute w-100 shadow-sm"
                                        style="z-index: 1000; max-height: 200px; overflow-y: auto; top: 100%;">
                                        <li v-for="(nama, index) in suggestionTujuan" :key="index"
                                            class="list-group-item list-group-item-action" style="cursor: pointer;"
                                            @click="selectTujuan(nama)">
                                            {{ nama }}
                                        </li>
                                    </ul>

                                    <div class="invalid-feedback" v-if="errors.tujuan">
                                        {{ Array.isArray(errors.tujuan) ? errors.tujuan[0] : errors.tujuan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>Kategori <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.kategori" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kategori }">
                                    <div class="invalid-feedback" v-if="errors.kategori">
                                        {{ Array.isArray(errors.kategori) ? errors.kategori[0] : errors.kategori }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label class="form-label">Periode Tanggal <span
                                            class="login-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="date" v-model="formInvoice.periodeawal" class="form-control"
                                            :class="{ 'is-invalid': errors.periodeawal }" placeholder="Mulai">
                                        <span class="input-group-text badge-gradient-secondary text-white">s/d</span>
                                        <input type="date" v-model="formInvoice.periodeakhir" class="form-control"
                                            :class="{ 'is-invalid': errors.periodeakhir }" placeholder="Selesai">
                                    </div>
                                    <div class="text-danger small mt-1"
                                        v-if="errors.periodeawal || errors.periodeakhir">
                                        {{ errors.periodeawal || errors.periodeakhir }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : ('Filter Invoice')
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalPrintInvoice" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        PRINT INVOICE
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handlePrint">
                    <div class="modal-body p-4">
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>TANGGAL <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.tanggal" type="date" class="form-control"
                                        :class="{ 'is-invalid': errors.tanggal }">
                                    <div class="invalid-feedback" v-if="errors.tanggal">
                                        {{ Array.isArray(errors.tanggal) ? errors.tanggal[0] :
                                            errors.tanggal }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>No. Invoice <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.nomorinvoice" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.nomorinvoice }">
                                    <div class="invalid-feedback" v-if="errors.nomorinvoice">
                                        {{ Array.isArray(errors.nomorinvoice) ? errors.nomorinvoice[0] :
                                            errors.nomorinvoice }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : ('Print Invoice')
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useInvoice } from '../composables/useInvoice';

const {
    suggestionTujuan,
    suggestionPengambilan,
    showSuggestionsTujuan,
    showSuggestions,
    fetchReferensiJarak,
    selectPengambilan,
    selectTujuan,
    formInvoice,
    errors,
    submitGetInvoice,
    submitPrint,
    isLoading
} = useInvoice();

onMounted(() => {
    fetchReferensiJarak(); // Ambil data referensi saat modal/page dibuka
});

const handleSubmit = async () => {
    await submitGetInvoice();
}

const handlePrint = async () => {
    submitPrint();
}
</script>
