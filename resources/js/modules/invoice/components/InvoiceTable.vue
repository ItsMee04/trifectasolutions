<template>
    <div class="card card-table">
        <div class="card-body">
            <div class="page-header">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="card-title">Daftar Invoice</h5>
                    </div>

                    <div class="col-auto d-flex align-items-center flex-wrap">
                        <div class="top-nav-search me-2 mb-2 mb-sm-0">
                            <div class="input-group" style="max-width: 200px;">
                                <span class="input-group-text bg-transparent border-end-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input v-model="searchQuery" type="text" class="form-control border-start-0 ps-0"
                                    placeholder="Cari...">
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <a class="btn btn-primary btn-sm p-2 d-flex align-items-center" @click="handleRefresh"
                                :disabled="isLoading" title="Reset & Refresh">
                                <i class="feather-rotate-cw" :class="{ 'fa-spin': isLoading }"></i>
                            </a>

                            <a class="btn btn-success btn-sm p-2 d-flex align-items-center" :disabled="!lastFilter"
                                @click="handlePrintInvoice">
                                <span class="fas fa-print"></span>
                            </a>

                            <a class="btn btn-primary btn-sm p-2 d-flex align-items-center"
                                @click="handleFilterInvoice">
                                <span class="fas fa-search"> FILTER INVOICE</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-nowrap table-hover mb-0">
                    <thead>
                        <tr class="text-center">
                            <th style="width: 5%">#</th>
                            <th style="width: 20%">Tanggal</th>
                            <th style="width: 20%">Driver</th>
                            <th style="width: 20%">No. Polisi</th>
                            <th style="width: 20%">Material</th>
                            <th style="width: 20%">RIT</th>
                            <th style="width: 20%">Volume</th>
                            <th style="width: 20%">Satuan</th>
                            <th style="width: 20%">Harga</th>
                            <th style="width: 20%">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="10" class="text-center p-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-2 mb-0">Memuat data...</p>
                            </td>
                        </tr>

                        <tr v-else-if="!paginatedInvoice || paginatedInvoice.length === 0">
                            <td colspan="10" class="text-center p-5">Tidak ada data.</td>
                        </tr>

                        <template v-else>
                            <tr v-for="(item, index) in paginatedInvoice" :key="item.id" class="text-center">
                                <td>{{ ((currentPage - 1) * 10) + (index + 1) }}</td>
                                <td>{{ item.tanggal }}</td>
                                <td>{{ item.driver?.nama }}</td>
                                <td>{{ item.kendaraan?.nomor }}</td>
                                <td>{{ item.jarak.material?.material }}</td>
                                <td>{{ item.rit }}</td>
                                <td>{{ item.volume }}</td>
                                <td>{{ item.satuan }}</td>
                                <td>{{ formatNumber(item.jarak?.hargajasa) }}</td>
                                <td>{{ formatNumber(item.penjualan) }}</td>
                            </tr>
                        </template>
                    </tbody>

                    <tfoot v-if="!isLoading && paginatedInvoice.length > 0">
                        <tr class="text-center fw-bold bg-light">
                            <td colspan="5" class="text-end">TOTAL</td>
                            <td>{{ formatNumber(totalFooter.ritTotal) }}</td>
                            <td>{{ formatNumber(totalFooter.volumeTotal) }}</td>
                            <td colspan="1" class="text-end"></td>
                            <td>{{ formatNumber(totalFooter.jasaTotal) }}</td>
                            <td>{{ formatNumber(totalFooter.penjualanTotal) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div v-if="filteredInvoice.length > 0" class="d-flex justify-content-between align-items-center p-3">

                <div class="text-muted small">
                    Showing {{ ((currentPage - 1) * 10) + 1 }}
                    to {{ Math.min(currentPage * 10, filteredInvoice.length) }}
                    of {{ filteredInvoice.length }} entries
                </div>

                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage > 1 && currentPage--">
                            Previous
                        </a>
                    </li>

                    <li v-for="page in totalPages" :key="page" class="page-item"
                        :class="{ active: currentPage === page }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = page">
                            {{ page }}
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="javascript:void(0);"
                            @click="currentPage < totalPages && currentPage++">
                            Next
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useInvoice } from '../composables/useInvoice';
// Destructure semua yang dibutuhkan dari composable
const {
    handleFilterInvoice,
    handlePrintInvoice,
    handleEdit,
    handleDelete,
    handleRefresh,
    formatNumber,

    lastFilter,
    totalFooter,
    filteredInvoice,
    paginatedInvoice,
    searchQuery,
    isLoading,
    currentPage,
    totalPages
} = useInvoice();
</script>
