<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Harga & Jarak {{ typeTitle }}</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Kegiatan Armada</li>
                            <li class="breadcrumb-item active">Harga & Jarak {{ typeTitle }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div v-if="isLoadingRoute" class="card">
                    <div class="card-body text-center">
                        <p>Memuat data...</p>
                    </div>
                </div>
                <JarakHargaTable v-else />
            </div>
        </div>

        <JarakHargaModal />
    </div>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useJarakDanHarga } from '../composables/useJarakHarga';
import JarakHargaTable from '../components/JarakHargaTable.vue';
import JarakHargaModal from '../components/JarakHargaModal.vue';

const route = useRoute();
const { fetchJarakDanHarga } = useJarakDanHarga();
const isLoadingRoute = ref(false);

// Judul dinamis (AMP, CBP, SC)
const typeTitle = computed(() => {
    const t = route.params.type;
    return t ? t.toUpperCase() : '';
});

const loadData = async () => {
    isLoadingRoute.value = true;
    const type = route.params.type;
    // Panggil fetch dengan parameter type
    await fetchJarakDanHarga(type);
    isLoadingRoute.value = false;
};

// Re-fetch data ketika parameter :type di URL berubah
watch(() => route.params.type, () => {
    loadData();
});

onMounted(() => {
    loadData();
});
</script>
