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
                                <div class="form-group local-forms mb-3">
                                    <label>Pengambilan <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.pengambilan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.pengambilan }">
                                    <div class="invalid-feedback" v-if="errors.pengambilan">
                                        {{ Array.isArray(errors.pengambilan) ? errors.pengambilan[0] :
                                        errors.pengambilan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>Tujuan <span class="login-danger">*</span></label>
                                    <input v-model="formInvoice.tujuan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.tujuan }">
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
                                        {{ Array.isArray(errors.nomorinvoice) ? errors.nomorinvoice[0] : errors.nomorinvoice }}
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
    formInvoice,
    errors,
    submitGetInvoice,
    submitPrint,
    isLoading
} = useInvoice();

const handleSubmit = async () => {
    await submitGetInvoice();
}

const handlePrint = async () => {
    submitPrint();
}
</script>
