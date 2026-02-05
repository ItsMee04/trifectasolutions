<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Harga & Jarak</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Kegiatan Armada</li>
                            <li class="breadcrumb-item active">Harga & Jarak</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <JarakHargaTable />
            </div>
        </div>

        <JarakHargaModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useJarakDanHarga } from '../composables/useJarakHarga';
import JarakHargaTable from '../components/JarakHargaTable.vue';
import JarakHargaModal from '../components/JarakHargaModal.vue';

const { fetchJarakDanHarga } = useJarakDanHarga();

onMounted(() => {
    fetchJarakDanHarga();
});
</script>
