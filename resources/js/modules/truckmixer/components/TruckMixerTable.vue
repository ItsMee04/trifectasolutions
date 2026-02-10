<!-- <template>
    <div class="card card-table">
        <div class="card-body">
            <div class="page-header">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="card-title">Daftar Invoice Truck Mixer (TM)</h5>
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
                                :class="{ 'disabled': isLoading }">
                                <i class="feather-rotate-cw" :class="{ 'fa-spin': isLoading }"></i>
                            </a>

                            <a class="btn btn-primary btn-sm p-2 d-flex align-items-center" @click="handleCreate">
                                <i class="feather-plus"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-nowrap table-hover mb-0">
                    <thead class="bg-light">
                        <tr class="text-center">
                            <th style="width: 5%">#</th>
                            <th style="width: 20%">Tanggal</th>
                            <th style="width: 20%">Kegiatan / Tujuan</th>
                            <th style="width: 20%">Vol / RIT</th>
                            <th style="width: 20%">Jarak</th>
                            <th style="width: 20%">Upah</th>
                            <th style="width: 20%">Jumlah</th>
                            <th style="width: 20%">UM</th>
                            <th style="width: 20%">Extra</th>
                            <th style="width: 20%">Diterima</th>
                            <th style="width: 20%">Keterangan</th>
                            <th style="width: 20%">Uang Jalan</th>
                            <th style="width: 20%">Status</th>
                            <th style="width: 20%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="14" class="text-center p-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-2 mb-0">Memuat data...</p>
                            </td>
                        </tr>

                        <tr v-else-if="!paginatedTruckMixer || paginatedTruckMixer.length === 0">
                            <td colspan="14" class="text-center p-5">Tidak ada data.</td>
                        </tr>

                        <template v-else>
                            <tr v-for="(item, index) in paginatedTruckMixer" :key="item.id" class="text-center">
                                <td>{{ ((currentPage - 1) * 10) + (index + 1) }}</td>
                                <td>{{ item.tanggal }}</td>
                                <td>{{ item.jarak?.tujuan }}</td>
                                <td>{{ item.jarak?.source?.volume }}</td>
                                <td>{{ item.jarak?.jarak }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.umpengajuan }}</td>
                                <td>{{ item.umpengajuan }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>
                                    <span v-if="item.status == 1" class="badge bg-success">
                                        ACTIVE
                                    </span>
                                    <span v-else class="badge bg-danger">
                                        INACTIVE
                                    </span>
                                </td>
                                <td>
                                    <div class="actions d-flex justify-content-center">
                                        <a @click="handleEdit(item)" class="btn btn-sm bg-success-light me-2">
                                            <i class="feather-edit"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div v-if="filtereTruckMixer.length > 0" class="d-flex justify-content-between align-items-center p-3">

                <div class="text-muted small">
                    Showing {{ ((currentPage - 1) * 10) + 1 }}
                    to {{ Math.min(currentPage * 10, filtereTruckMixer.length) }}
                    of {{ filtereTruckMixer.length }} entries
                </div>

                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = 1">
                            <i class="fas fa-angle-double-left"></i>
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage > 1 && currentPage--">
                            Previous
                        </a>
                    </li>

                    <li v-for="page in displayedPages" :key="page" class="page-item"
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

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = totalPages">
                            <i class="fas fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template> -->

<!-- <script setup>
import { useTruckMixer } from '../composables/useTruckMixer';
// Destructure semua yang dibutuhkan dari composable
const {
    // handleCreate,
    // handleEdit,
    // handleDelete,
    handleRefresh,
    displayedPages,
    filtereTruckMixer,
    paginatedTruckMixer,
    searchQuery,
    isLoading,
    currentPage,
    totalPages
} = useTruckMixer();
</script> -->

<template>
    <div class="card card-table">
        <div class="card-body">
            <div class="page-header">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="card-title">Daftar Invoice Truck Mixer (TM)</h5>
                    </div>

                    <div class="col-auto d-flex align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-1">
                            <div class="input-group input-group-sm shadow-sm" style="width: 320px;">
                                <span class="input-group-text bg-white border-end-0">
                                    <i class="fas fa-calendar-alt text-muted small"></i>
                                </span>

                                <input v-model="startDate" type="date"
                                    class="form-control border-start-0 border-end-0 ps-0" title="Tanggal Mulai">

                                <span
                                    class="input-group-text bg-white border-start-0 border-end-0 px-1 text-muted">-</span>

                                <input v-model="endDate" type="date" class="form-control border-start-0 ps-0"
                                    title="Tanggal Selesai">
                            </div>

                            <button v-if="startDate || endDate" @click="resetDateFilter"
                                class="btn btn-light btn-sm border shadow-sm">
                                <i class="fas fa-times text-danger"></i>
                            </button>
                        </div>

                        <div class="top-nav-search">
                            <div class="input-group">
                                <span class="input-group-text bg-transparent border-end-0 py-1">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input v-model="searchQuery" type="text"
                                    class="form-control form-control-sm border-start-0 ps-0" placeholder="Cari..."
                                    style="max-width: 150px;">
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-primary btn-sm p-2 d-flex align-items-center shadow-sm"
                                @click="handleRefresh" :class="{ 'disabled': isLoading }">
                                <i class="feather-rotate-cw" :class="{ 'fa-spin': isLoading }"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-nowrap table-hover mb-0">
                    <thead class="bg-light">
                        <tr class="text-center">
                            <th style="width: 5%">#</th>
                            <th style="width: 20%">Tanggal</th>
                            <th style="width: 20%">Kegiatan / Tujuan</th>
                            <th style="width: 20%">Vol / RIT</th>
                            <th style="width: 20%">Jarak</th>
                            <th style="width: 20%">Upah</th>
                            <th style="width: 20%">Jumlah</th>
                            <th style="width: 20%">UM</th>
                            <th style="width: 20%">Extra</th>
                            <th style="width: 20%">Diterima</th>
                            <th style="width: 20%">Keterangan</th>
                            <th style="width: 20%">Uang Jalan</th>
                            <th style="width: 20%">Status</th>
                            <th style="width: 20%">Action</th>
                        </tr>
                        <tr class="text-center bg-white">
                            <td></td>
                            <td>
                                <input v-model="columnFilters.tanggal" type="date" class="form-control form-control-sm">
                            </td>
                            <td>
                                <input v-model="columnFilters.tujuan" class="form-control form-control-sm"
                                    placeholder="Filter...">
                            </td>
                            <td>
                                <input v-model="columnFilters.volume" class="form-control form-control-sm"
                                    placeholder="Filter...">
                            </td>
                            <td>
                                <input v-model="columnFilters.jarak" class="form-control form-control-sm"
                                    placeholder="Filter...">
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.jumlah" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.um" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.extra" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.diterima" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.keterangan" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.uangjalan" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.uangjalan" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <!-- <input v-model="columnFilters.uangjalan" class="form-control form-control-sm"
                                    placeholder="Filter..."> -->
                            </td>
                            <td>
                                <button @click="resetColumnFilters" class="btn btn-outline-danger btn-sm"
                                    title="Reset Filter">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="13" class="text-center p-5">
                                <div class="spinner-border text-primary" users="status"></div>
                                <p class="mt-2 mb-0">Memuat data...</p>
                            </td>
                        </tr>

                        <tr v-else-if="!paginatedTruckMixer || paginatedTruckMixer.length === 0">
                            <td colspan="13" class="text-center p-5">Tidak ada data.</td>
                        </tr>

                        <template v-else>
                            <tr v-for="(item, index) in paginatedTruckMixer" :key="item.id" class="text-center">
                                <td>{{ ((currentPage - 1) * 10) + (index + 1) }}</td>
                                <td>{{ item.tanggal }}</td>
                                <td>{{ item.jarak?.tujuan }}</td>
                                <td>{{ item.jarak?.source?.volume }}</td>
                                <td>{{ item.jarak?.jarak }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.umpengajuan }}</td>
                                <td>{{ item.umpengajuan }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>{{ item.upah }}</td>
                                <td>
                                    <span v-if="item.status == 1" class="badge bg-success">
                                        ACTIVE
                                    </span>
                                    <span v-else class="badge bg-danger">
                                        INACTIVE
                                    </span>
                                </td>
                                <td>
                                    <div class="actions d-flex justify-content-center">
                                        <a @click="handleEdit(item)" class="btn btn-sm bg-success-light me-2">
                                            <i class="feather-edit"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>

                    <tfoot v-if="!isLoading && paginatedTruckMixer.length > 0">
                        <tr class="text-center fw-bold bg-light">
                            <td colspan="3" class="text-end">TOTAL</td>
                            <td>{{ formatNumber(totalFooter.volumeTotal, 2) }}</td>
                            <td>{{ formatNumber(totalFooter.jarakTotal, 2) }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div v-if="filteredTruckMixer.length > 0" class="d-flex justify-content-between align-items-center p-3">

                <div class="text-muted small">
                    Showing {{ ((currentPage - 1) * 10) + 1 }}
                    to {{ Math.min(currentPage * 10, filteredTruckMixer.length) }}
                    of {{ filteredTruckMixer.length }} entries
                </div>

                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = 1">
                            <i class="fas fa-angle-double-left"></i>
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage > 1 && currentPage--">
                            Previous
                        </a>
                    </li>

                    <li v-for="page in displayedPages" :key="page" class="page-item"
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

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = totalPages">
                            <i class="fas fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTruckMixer } from '../composables/useTruckMixer';
// Destructure semua yang dibutuhkan dari composable
const {
    handleEdit,
    handleRefresh,
    formatNumber,
    columnFilters,
    resetColumnFilters,

    startDate,
    endDate,
    resetDateFilter,
    displayedPages,
    totalFooter,
    filteredTruckMixer,
    paginatedTruckMixer,
    searchQuery,
    isLoading,
    currentPage,
    totalPages
} = useTruckMixer();
</script>
