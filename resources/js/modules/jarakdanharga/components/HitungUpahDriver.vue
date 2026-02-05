<template>
    <div class="modal fade" id="modalHitungUpdahDriver" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column align-items-start">
                    <div class="d-flex justify-content-between w-100">
                        <h5 class="modal-title text-primary">
                            {{ isEdit ? 'EDIT HITUNG UPAH DRIVER' : 'TAMBAH HITUNG UPAH DRIVER' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="mt-2">
                        <span class="badge bg-primary-light text-info me-2">
                            <i class="fas fa-truck me-1"></i> Kendaraan: {{ formJarakDanHarga.jenisKendaraan || '-' }}
                        </span>
                        <span class="badge bg-warning-light text-secondary">
                            <i class="fas fa-box me-1"></i> Kategori Material: {{ formJarakDanHarga.kategoriMaterial || '-' }}
                        </span>
                    </div>
                </div>
                <form @submit.prevent="handleSubmitUpahDriver">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jarak Index KM<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.jarak" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jarak }" readonly="">
                                        <div class="invalid-feedback" v-if="errors.jarak">
                                            {{ Array.isArray(errors.jarak) ? errors.jarak[0] : errors.jarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Upah Harian<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.upahharian" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.upahharian }">
                                        <div class="invalid-feedback" v-if="errors.upahharian">
                                            {{ Array.isArray(errors.upahharian) ? errors.upahharian[0] :
                                                errors.upahharian }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jam Kerja<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.jamkerja" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jamkerja }">
                                        <div class="invalid-feedback" v-if="errors.jamkerja">
                                            {{ Array.isArray(errors.jamkerja) ? errors.jamkerja[0] : errors.jamkerja }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jarak Index KM<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.jarakindexkm" type="text" value="240"
                                            class="form-control" :class="{ 'is-invalid': errors.jarakindexkm }"
                                            readonly="">
                                        <div class="invalid-feedback" v-if="errors.jarakindexkm">
                                            {{ Array.isArray(errors.jarakindexkm) ? errors.jarakindexkm[0] :
                                                errors.jarakindexkm }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Harga Solar<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.hargasolar" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.hargasolar }">
                                        <div class="invalid-feedback" v-if="errors.hargasolar">
                                            {{ Array.isArray(errors.hargasolar) ? errors.hargasolar[0] :
                                                errors.hargasolar }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Index Solar KM<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.indexsolarkm" type="text" value="240"
                                            class="form-control" :class="{ 'is-invalid': errors.indexsolarkm }"
                                            readonly="">
                                        <div class="invalid-feedback" v-if="errors.indexsolarkm">
                                            {{ Array.isArray(errors.indexsolarkm) ? errors.indexsolarkm[0] :
                                                errors.indexsolarkm }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Tonase<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.tonase" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.tonase }" readonly="">
                                        <div class="invalid-feedback" v-if="errors.tonase">
                                            {{ Array.isArray(errors.tonase) ? errors.tonase[0] : errors.tonase }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Upah Harian Invoice<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.upahharianinvoice" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.upahharianinvoice }">
                                        <div class="invalid-feedback" v-if="errors.upahharianinvoice">
                                            {{ Array.isArray(errors.upahharianinvoice) ? errors.upahharianinvoice[0] :
                                                errors.upahharianinvoice }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex align-items-center my-4">
                            <hr class="flex-grow-1 m-0">
                            <span class="mx-3 fw-bold text-secondary" style="font-size: 0.85rem; letter-spacing: 1px;">
                                PERHITUNGAN RITASE
                            </span>
                            <hr class="flex-grow-1 m-0">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>WAKTU JARAK<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.waktujarak" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.waktujarak }">
                                        <div class="invalid-feedback" v-if="errors.waktujarak">
                                            {{ Array.isArray(errors.waktujarak) ? errors.waktujarak[0] :
                                            errors.waktujarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>WAKTU BONGKAR MUAT MATERIAL<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.waktubongkarmuatmaterial" type="text"
                                            value="240" class="form-control"
                                            :class="{ 'is-invalid': errors.waktubongkarmuatmaterial }">
                                        <div class="invalid-feedback" v-if="errors.waktubongkarmuatmaterial">
                                            {{ Array.isArray(errors.waktubongkarmuatmaterial) ?
                                                errors.waktubongkarmuatmaterial[0] :
                                            errors.waktubongkarmuatmaterial }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>KEBUTUHAN WAKTU JARAK+BONGKAR MUAT<span
                                                class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.kebutuhanwaktujarakwaktubongkarmuat"
                                            type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.kebutuhanwaktujarakwaktubongkarmuat }">
                                        <div class="invalid-feedback" v-if="errors.kebutuhanwaktujarakwaktubongkarmuat">
                                            {{ Array.isArray(errors.kebutuhanwaktujarakwaktubongkarmuat) ?
                                                errors.kebutuhanwaktujarakwaktubongkarmuat[0] :
                                            errors.kebutuhanwaktujarakwaktubongkarmuat }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>PERKIRAAN PEROLEHAN RITASE<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.perkiraanperolehanritase" type="text"
                                            value="240" class="form-control"
                                            :class="{ 'is-invalid': errors.perkiraanperolehanritase }">
                                        <div class="invalid-feedback" v-if="errors.perkiraanperolehanritase">
                                            {{ Array.isArray(errors.perkiraanperolehanritase) ?
                                                errors.perkiraanperolehanritase[0] :
                                            errors.perkiraanperolehanritase }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group local-forms mb-3">
                                    <label>PEMBULATAN<span class="login-danger">*</span></label>
                                    <input v-model="formJarakDanHarga.pembulatan" type="text" value="240"
                                        class="form-control" :class="{ 'is-invalid': errors.pembulatan }">
                                    <div class="invalid-feedback" v-if="errors.pembulatan">
                                        {{ Array.isArray(errors.pembulatan) ? errors.pembulatan[0] :
                                            errors.pembulatan }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex align-items-center my-4">
                            <hr class="flex-grow-1 m-0">
                            <span class="mx-3 fw-bold text-secondary" style="font-size: 0.85rem; letter-spacing: 1px;">
                                PERHITUNGAN UPAH
                            </span>
                            <hr class="flex-grow-1 m-0">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>SOLAR JARAK<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.solarjarak" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.solarjarak }">
                                        <div class="invalid-feedback" v-if="errors.solarjarak">
                                            {{ Array.isArray(errors.solarjarak) ? errors.solarjarak[0] :
                                            errors.solarjarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>UPAH HARIAN DRIVER<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.upahhariandriver" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.upahhariandriver }">
                                        <div class="invalid-feedback" v-if="errors.upahhariandriver">
                                            {{ Array.isArray(errors.upahhariandriver) ? errors.upahhariandriver[0] :
                                                errors.upahhariandriver }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>UPAH DRIVER<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.upahdriver" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.upahdriver }">
                                        <div class="invalid-feedback" v-if="errors.upahdriver">
                                            {{ Array.isArray(errors.upahdriver) ? errors.upahdriver[0] : errors.upahdriver }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>UPAH PER M3 INVOICE<span class="login-danger">*</span></label>
                                        <input v-model="formJarakDanHarga.upahpermaterial" type="text" value="240"
                                            class="form-control" :class="{ 'is-invalid': errors.upahpermaterial }">
                                        <div class="invalid-feedback" v-if="errors.upahpermaterial">
                                            {{ Array.isArray(errors.upahpermaterial) ? errors.upahpermaterial[0] :
                                                errors.upahpermaterial }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Upah Driver' : 'Simpan Upah Driver')
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
// import Multiselect from '@vueform/multiselect';
// import '@vueform/multiselect/themes/default.css';
import { useJarakDanHarga } from '../composables/useJarakHarga';

const {
    handleHitungUpahDriver,
    handleSubmitUpahDriver,
    isEdit,
    formJarakDanHarga,
    errors,
    submitJarakDanHarga,
    isLoading,
} = useJarakDanHarga();

// const handleSubmit = async () => {
//     await submitJarakDanHarga();
// }
</script>
