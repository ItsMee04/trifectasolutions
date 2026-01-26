<template>
    <div class="sidebar" id="sidebar">
        <div class="sidebar-inner">
            <div id="sidebar-menu" class="sidebar-menu">
                <ul>
                    <li class="menu-title"><span>Main Menu</span></li>

                    <li :class="{ active: $route.name === 'dashboard' }">
                        <router-link to="/dashboard">
                            <i class="fas fa-home"></i> <span>Dashboard</span>
                        </router-link>
                    </li>

                    <li class="submenu" :class="{ active: isMasterActive }">
                        <a
                            href="javascript:void(0);"
                            @click="toggleMenu('master')"
                            :class="{ 'subdrop': openMenu === 'master' }"
                        >
                            <i class="fas fa-server"></i> <span> Master</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'master' }]">
                            <li v-for="item in masterItems" :key="item.path">
                                <router-link
                                    :to="item.path"
                                    :class="{ active: $route.path === item.path }"
                                >
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="submenu" :class="{ active: isTimbanganActive }">
                        <a
                            href="javascript:void(0);"
                            @click="toggleMenu('timbangan')"
                            :class="{ 'subdrop': openMenu === 'timbangan' }"
                        >
                            <i class="fas fa-balance-scale"></i> <span> Timbangan</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'timbangan' }]">
                            <li v-for="item in timbanganItems" :key="item.path">
                                <router-link
                                    :to="item.path"
                                    :class="{ active: $route.path === item.path }"
                                >
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="submenu" :class="{ active: isKegiatanArmadaActive }">
                        <a
                            href="javascript:void(0);"
                            @click="toggleMenu('kegiatan')"
                            :class="{ 'subdrop': openMenu === 'kegiatan' }"
                        >
                            <i class="fas fa-truck"></i> <span> Kegiatan Armada</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'kegiatan' }]">
                            <li v-for="item in kegiatanArmadaItems" :key="item.path">
                                <router-link
                                    :to="item.path"
                                    :class="{ active: $route.path === item.path }"
                                >
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const openMenu = ref('');

const masterItems = [
    { name: 'Role', path: '/role' },
    { name: 'Pegawai', path: '/pegawai' },
    { name: 'Users', path: '/users' },
    { name: 'Driver', path: '/driver' },
    { name: 'Suplier', path: '/suplier' },
    { name: 'Kendaraan', path: '/kendaraan' },
    { name: 'Kategori', path: '/kategori' },
    { name: 'Material', path: '/material' },
];

const timbanganItems = [
    { name: 'Timbangan Masuk', path: '/timbangan-masuk' },
    { name: 'Timbangan Keluar', path: '/timbangan-keluar' },
];

const kegiatanArmadaItems = [
    { name: 'Jarak & Harga', path: '/jarakdanharga' },
    { name: 'Kegiatan Armada', path: '/kegiatanarmada' },
];


const isMasterActive = computed(() => masterItems.some(item => route.path === item.path));
const isTimbanganActive = computed(() => timbanganItems.some(item => route.path === item.path));
const isKegiatanArmadaActive = computed(() => kegiatanArmadaItems.some(item => route.path === item.path));

// Fungsi untuk menentukan menu mana yang harus terbuka berdasarkan rute aktif
const updateMenuState = () => {
    if (isMasterActive.value) openMenu.value = 'master';
    else if (isTimbanganActive.value) openMenu.value = 'timbangan';
    else if (isKegiatanArmadaActive.value) openMenu.value = 'kegiatan';
    else openMenu.value = ''; // Menutup menu jika tidak ada anak yang aktif (ex: Dashboard)
};

// Pantau perubahan rute untuk menutup/membuka menu secara otomatis
watch(() => route.path, () => {
    updateMenuState();
});

onMounted(() => {
    updateMenuState();
});

const toggleMenu = (menuName) => {
    openMenu.value = openMenu.value === menuName ? '' : menuName;
};
</script>

<style scoped>
.sidebar-menu ul ul {
    display: block !important;
}

.submenu-list {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    opacity: 0;
    list-style: none;
    padding: 0;
    margin: 0;
}

.is-open {
    max-height: 1000px;
    opacity: 1;
}

/* Base style link submenu */
.sidebar-menu ul ul li a {
    padding: 10px 15px 10px 45px !important; /* Indentasi teks ke kanan */
    display: block;
    font-size: 14px;
    color: #6c757d;
    transition: all 0.2s ease;
    border-radius: 10px; /* Sudut tumpul */
    margin: 2px 15px 2px 25px; /* Memberi jarak agar block tidak menempel pinggir */
}

/* Hover & Active State (Ukuran harus sama) */
.sidebar-menu ul ul li a:hover,
.sidebar-menu ul ul li a.active {
    background-color: #3d5ee1 !important; /* Warna biru template */
    color: #ffffff !important;
}

/* Arrow Rotation */
.menu-arrow {
    transition: transform 0.3s ease-in-out !important;
}
.subdrop .menu-arrow {
    transform: rotate(90deg) !important;
}

.sidebar-inner {
    height: calc(100vh - 60px);
    overflow-y: auto;
}
</style>
