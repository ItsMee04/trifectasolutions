import './bootstrap';
import Toast from "vue-toastification";
// Import CSS bawaan sebagai dasar (nanti ditimpa CSS template)
import "vue-toastification/dist/index.css";

import { createApp, Transition } from 'vue';
import App from '@/Views/App.vue';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // Import plugin persist
import router from './router'; // <-- Import router ini

import * as bootstrap from 'bootstrap'; // Import JS
window.bootstrap = bootstrap; // Jadikan global agar useRole.js bisa baca

const app = createApp(App);
// --- Konfigurasi Pinia ---
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Daftarkan plugin ke Pinia
const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    timeout: 2000,
};

app.use(pinia);
app.use(router); // <-- Gunakan router
app.use(Toast, options)
app.mount('#app');
