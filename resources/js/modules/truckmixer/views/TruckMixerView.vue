<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Upah Truck Mixer</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Invoice</li>
                            <li class="breadcrumb-item active">Upah Truck Mixer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <TruckMixerTable />
            </div>
        </div>

        <!-- <JarakHargaModal /> -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTruckMixer } from '../composables/useTruckMixer';
import TruckMixerTable from '../components/TruckMixerTable.vue';
// import JarakHargaTable from '../components/JarakHargaTable.vue';
// import JarakHargaModal from '../components/JarakHargaModal.vue';

const { fetchTruckMixer } = useTruckMixer();

onMounted(() => {
    fetchTruckMixer();
});
</script>
