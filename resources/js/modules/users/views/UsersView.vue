<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Users</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Users</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <UsersTable />
            </div>
        </div>

        <UsersModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsers } from '../composables/useUsers';
import UsersTable from '../components/UsersTable.vue';
import UsersModal from '../components/UsersModal.vue';

const { fetchUsers } = useUsers();

onMounted(() => {
    fetchUsers();
});
</script>
