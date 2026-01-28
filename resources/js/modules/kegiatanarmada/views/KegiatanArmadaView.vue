<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Kegiatan Armada</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Kegiatan Armada</li>
                            <li class="breadcrumb-item active">Kegiatan Armada</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <KegiatanArmadaTable />
            </div>
        </div>

        <KegiatanArmadaModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useKegiatanArmada } from '../composables/useKegiatanArmada';
import KegiatanArmadaTable from '../components/KegiatanArmadaTable.vue';
import KegiatanArmadaModal from '../components/KegiatanArmadaModal.vue';

const { fetchKegiatanArmada } = useKegiatanArmada();

onMounted(() => {
    fetchKegiatanArmada();
});
</script>
