<template>
    <div class="modal fade" id="modalJarak" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT JARAK & HARGA' : 'TAMBAH JARAK & HARGA' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="col-md-12">
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
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>Harga Upah Driver <span class="login-danger">*</span></label>

                                    <div class="input-group">
                                        <input v-model="formJarakDanHarga.hargaupah" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.hargaupah }"
                                            readonly="">

                                        <button class="btn btn-primary" type="button" @click="handleHitungUpahDriver">
                                            <i class="fas fa-calculator me-1"></i> Hitung
                                        </button>

                                        <div class="invalid-feedback" v-if="errors.hargaupah" style="display: block;">
                                            {{ Array.isArray(errors.hargaupah) ? errors.hargaupah[0] : errors.hargaupah
                                            }}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>Harga Jasa Angkut <span class="login-danger">*</span></label>
                                    <input v-model="formJarakDanHarga.hargajasa" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.hargajasa }">
                                    <div class="invalid-feedback" v-if="errors.hargajasa">
                                        {{ Array.isArray(errors.hargajasa) ? errors.hargajasa[0] : errors.hargajasa
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>Harga Solar <span class="login-danger">*</span></label>
                                    <input v-model="formJarakDanHarga.hargasolar" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.hargasolar }">
                                    <div class="invalid-feedback" v-if="errors.hargasolar">
                                        {{ Array.isArray(errors.hargasolar) ? errors.hargasolar[0] : errors.hargasolar
                                        }}
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
    handleHitungUpahDriver,
    isEdit,
    formJarakDanHarga,
    errors,
    submitJarakDanHarga,
    isLoading,
} = useJarakDanHarga();

const handleSubmit = async () => {
    await submitJarakDanHarga();
}
</script>
