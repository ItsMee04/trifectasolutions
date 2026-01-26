<template>
    <div class="header">
        <div class="header-left">
            <router-link to="/" class="logo">
                <img src="/public/assets/img/logo.png" alt="Logo">
            </router-link>
            <router-link to="/" class="logo logo-small">
                <img src="/public/assets/img/logo-small.png" alt="Logo" width="30" height="30">
            </router-link>
        </div>

        <div class="menu-toggle">
            <a href="javascript:void(0);" id="toggle_btn" @click="handleToggleSidebar">
                <i class="fas fa-bars"></i>
            </a>
        </div>

        <div class="top-nav-search d-none d-md-flex">
            <div class="d-flex align-items-center" style="height: 60px; min-width: 350px; white-space: nowrap;">
                <div class="header-datetime text-primary fw-bold">
                    <i class="fas fa-calendar-alt me-2"></i>
                    <span class="mx-2 text-muted">|</span>
                    <i class="fas fa-clock me-2"></i>
                    <span>{{ currentDateTime }}</span>
                </div>
            </div>
        </div>

        <a class="mobile_btn" id="mobile_btn" @click="handleMobileMenu">
            <i class="fas fa-bars"></i>
        </a>

        <ul class="nav user-menu">
            <li class="nav-item dropdown noti-dropdown me-2">
                <a href="#" class="dropdown-toggle nav-link header-nav-list" data-bs-toggle="dropdown">
                    <img src="/public/assets/img/icons/header-icon-05.svg" alt="">
                </a>
                <div class="dropdown-menu notifications">
                    <div class="topnav-dropdown-header">
                        <span class="notification-title">Notifications</span>
                        <a href="javascript:void(0)" class="clear-noti"> Clear All </a>
                    </div>
                    <div class="noti-content">
                        <ul class="notification-list">
                            <li class="notification-message">
                                <a href="#">
                                    <div class="media d-flex">
                                        <span class="avatar avatar-sm flex-shrink-0">
                                            <img class="avatar-img rounded-circle" alt="User Image"
                                                src="/public/assets/img/profiles/avatar-02.jpg">
                                        </span>
                                        <div class="media-body flex-grow-1">
                                            <p class="noti-details"><span class="noti-title">Carlson Tech</span> has
                                                approved <span class="noti-title">your estimate</span></p>
                                            <p class="noti-time"><span class="notification-time">4 mins ago</span></p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="topnav-dropdown-footer">
                        <a href="#">View all Notifications</a>
                    </div>
                </div>
            </li>

            <li class="nav-item zoom-screen me-2">
                <a href="javascript:void(0);" class="nav-link header-nav-list" @click="handleFullscreen">
                    <img src="/public/assets/img/icons/header-icon-04.svg" alt="">
                </a>
            </li>

            <li class="nav-item dropdown has-arrow new-user-menus" :class="{ show: isProfileOpen }">
                <a href="javascript:void(0);" class="dropdown-toggle nav-link" @click.stop="toggleProfile">
                    <span class="user-img">
                        <img class="rounded-circle" src="/public/assets/img/profiles/avatar-01.jpg" width="31"
                            alt="Soeng Souy">
                        <div class="user-text">
                            <h6>Soeng Souy</h6>
                            <p class="text-muted mb-0">Administrator</p>
                        </div>
                    </span>
                </a>
                <div class="dropdown-menu dropdown-menu-end" :class="{ show: isProfileOpen }"
                    style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 60px, 0px);">
                    <div class="user-header">
                        <div class="avatar avatar-sm">
                            <img src="/public/assets/img/profiles/avatar-01.jpg" alt="User Image"
                                class="avatar-img rounded-circle">
                        </div>
                        <div class="user-text">
                            <h6>Soeng Souy</h6>
                            <p class="text-muted mb-0">Administrator</p>
                        </div>
                    </div>
                    <router-link class="dropdown-item" to="/profile" @click="isProfileOpen = false">My
                        Profile</router-link>
                    <router-link class="dropdown-item" to="/inbox" @click="isProfileOpen = false">Inbox</router-link>
                    <router-link class="dropdown-item" to="/login" @click="isProfileOpen = false">Logout</router-link>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentDateTime = ref('');
// Logic untuk dropdown profile
const isProfileOpen = ref(false);
const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value;
};
// Menutup dropdown saat klik di luar elemen
const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.new-user-menus');
    if (dropdown && !dropdown.contains(event.target)) {
        isProfileOpen.value = false;
    }
};
/**
 * Handle Toggle Sidebar Desktop
 * Menambahkan/menghapus class 'mini-sidebar' pada body
 */
const handleToggleSidebar = () => {
    document.body.classList.toggle('mini-sidebar');
    return false;
};

/**
 * Handle Mobile Menu
 * Melakukan toggle pada wrapper dan body untuk tampilan mobile
 */
const handleMobileMenu = () => {
    const wrapper = document.querySelector('.main-wrapper');
    if (wrapper) {
        wrapper.classList.toggle('slide-nav');
        document.body.classList.toggle('menu-opened');
    }

    // Toggle overlay (pastikan elemen .sidebar-overlay ada di layout utama)
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.classList.toggle('opened');
    }
    return false;
};

/**
 * Handle Fullscreen Mode
 * Menggantikan logic jQuery .zoom-screen menggunakan API Fullscreen native
 */
const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

const handleLogout = () => {
    // Implementasi logic logout Anda di sini
    console.log("Logging out...");
};

// Fungsi untuk memformat waktu (Hari, Tanggal Bulan Tahun - Jam:Menit:Detik)
const updateTime = () => {
    const now = new Date();

    // Opsi format untuk Indonesia
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const datePart = now.toLocaleDateString('id-ID', options);
    const timePart = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    currentDateTime.value = `${datePart} | ${timePart}`;
};

let timer;

onMounted(() => {
    updateTime(); // Jalankan langsung saat mounted
    timer = setInterval(updateTime, 1000); // Update setiap detik
    window.addEventListener('click', handleClickOutside);
    // Inisialisasi Feather Icons jika digunakan di template
    if (window.feather) {
        window.feather.replace();
    }
});

onUnmounted(() => {
    clearInterval(timer); // Bersihkan memory saat komponen dihancurkan
    window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Menjaga konsistensi tampilan tanpa menambahkan CSS baru sesuai instruksi */
.dropdown-menu.show {
    display: block;
}
</style>
