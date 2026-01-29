<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Invoice & Upah</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Kegiatan Armada</li>
                            <li class="breadcrumb-item active">Invoice & Upah</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <InvoiceTable />
            </div>
        </div>

        <InvoiceModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useInvoice } from '../composables/useInvoice';
import InvoiceTable from '../components/InvoiceTable.vue';
import InvoiceModal from '../components/InvoiceModal.vue';

const { fetchInvoice } = useInvoice();

onMounted(() => {
    fetchInvoice();
});
</script>
