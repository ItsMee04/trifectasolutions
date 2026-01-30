<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Bahan Bakar</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Bahan Bakar</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <BahanBakarTable />
            </div>
        </div>

        <BahanBakarModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBahanBakar } from '../composables/useBahanBakar';
import BahanBakarTable from '../components/BahanBakarTable.vue';
import BahanBakarModal from '../components/BahanBakarModal.vue';

const { fetchBahanBakar } = useBahanBakar();

onMounted(() => {
    fetchBahanBakar();
});
</script>
