<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Penjualan</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Penjualan</li>
                            <li class="breadcrumb-item active">Penjualan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <PenjualanTable />
            </div>
        </div>

        <!-- <PenjualanModal /> -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePenjualan } from '../composables/usePenjualan';
import PenjualanTable from '../components/PenjualanTable.vue';
// import KegiatanArmadaModal from '../components/KegiatanArmadaModal.vue';

const { fetchPenjualan } = usePenjualan();

onMounted(() => {
    fetchPenjualan();
});
</script>
