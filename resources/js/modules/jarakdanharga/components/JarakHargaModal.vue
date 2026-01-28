<template>
    <div class="modal fade" id="modalJarak" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT CBP' : 'TAMBAH CBP' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label> Material <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formJarakDanHarga.material_id" :options="materialList"
                                            :searchable="true" placeholder="Pilih Material"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.material_id }" />
                                        <div class="invalid-feedback" v-if="errors.material_id">
                                            {{ Array.isArray(errors.material_id) ? errors.material_id[0] :
                                                errors.material_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Pengambilan <span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.pengambilan" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.pengambilan }">
                                        <div class="invalid-feedback" v-if="errors.pengambilan">
                                            {{ Array.isArray(errors.pengambilan) ? errors.pengambilan[0] : errors.pengambilan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Tujuan <span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.tujuan" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.tujuan }">
                                        <div class="invalid-feedback" v-if="errors.tujuan">
                                            {{ Array.isArray(errors.tujuan) ? errors.tujuan[0] : errors.tujuan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jarak <span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.jarak" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jarak }">
                                        <div class="invalid-feedback" v-if="errors.jarak">
                                            {{ Array.isArray(errors.jarak) ? errors.jarak[0] : errors.jarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Harga Upah Driver <span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.hargaupah" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.hargaupah }">
                                        <div class="invalid-feedback" v-if="errors.hargaupah">
                                            {{ Array.isArray(errors.hargaupah) ? errors.hargaupah[0] : errors.hargaupah }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Harga Jasa Angkut <span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.hargajasa" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.hargajasa }">
                                        <div class="invalid-feedback" v-if="errors.hargajasa">
                                            {{ Array.isArray(errors.hargajasa) ? errors.hargajasa[0] : errors.hargajasa }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Jarak & Harga' : 'Simpan Jarak & Harga')
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
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { useJarakDanHarga } from '../composables/useJarakHarga';

const {
    isEdit,
    formJarakDanHarga,
    materialList,
    errors,
    fetchMaterial,
    submitJarakDanHarga,
    isLoading
} = useJarakDanHarga();

const handleSubmit = async () => {
    await submitJarakDanHarga();
}

onMounted(() => {
    fetchMaterial();
});
</script>
