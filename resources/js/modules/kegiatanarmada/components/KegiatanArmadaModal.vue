<template>
    <div class="modal fade" id="modalKegiatanArmada" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT KEGIATAN ARMADA' : 'TAMBAH KEGIATAN ARMADA' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>RIT <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.rit" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.rit }">
                                        <div class="invalid-feedback" v-if="errors.rit">
                                            {{ Array.isArray(errors.rit) ? errors.rit[0] : errors.rit }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Satuan <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.satuan" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.satuan }">
                                        <div class="invalid-feedback" v-if="errors.satuan">
                                            {{ Array.isArray(errors.satuan) ? errors.satuan[0] : errors.satuan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Upah Harian Kenet <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.upahhariankenet" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.upahhariankenet }">
                                        <div class="invalid-feedback" v-if="errors.upahhariankenet">
                                            {{ Array.isArray(errors.upahhariankenet) ? errors.upahhariankenet[0] :
                                            errors.upahhariankenet }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>UM Luar Kota Telah Terbayar <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.umluarkotatelahterbayar" type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.umluarkotatelahterbayar }">
                                        <div class="invalid-feedback" v-if="errors.umluarkotatelahterbayar">
                                            {{ Array.isArray(errors.umluarkotatelahterbayar) ?
                                                errors.umluarkotatelahterbayar[0] : errors.umluarkotatelahterbayar }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>UM Pengajuan <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.umpengajuan" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.umpengajuan }">
                                        <div class="invalid-feedback" v-if="errors.umpengajuan">
                                            {{ Array.isArray(errors.umpengajuan) ? errors.umpengajuan[0] :
                                            errors.umpengajuan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Insentif / Lembur <span class="login-danger">*</span></label>
                                        <input v-model="formKegiatanArmada.insentifataulembur" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.insentifataulembur }">
                                        <div class="invalid-feedback" v-if="errors.insentifataulembur">
                                            {{ Array.isArray(errors.insentifataulembur) ? errors.insentifataulembur[0] :
                                            errors.insentifataulembur }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Kegiatan Armada' : 'Simpan Kegiatan Armada')}}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useKegiatanArmada } from '../composables/useKegiatanArmada';

const {
    isEdit,
    formKegiatanArmada,
    errors,
    submitKegiatanArmada,
    isLoading
} = useKegiatanArmada();

const handleSubmit = async () => {
    await submitKegiatanArmada();
}
</script>
