import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import LoginView from "../modules/auth/views/LoginView.vue";

const routes = [
    {
        path: "/",
        redirect: "/login",
        meta: { guestOnly: true } // Tandai bahwa ini hanya untuk yang belum login
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: { guestOnly: true } // Tandai bahwa ini hanya untuk yang belum login
    },
    {
        path: "/",
        // MainLayout sebagai pembungkus utama
        component: () => import("../layouts/MainLayout.vue"),
        meta: { requiresAuth: true },
        // Semua halaman di bawah ini akan muncul di dalam <router-view v-slot="{ Component }"> milik MainLayout
        children: [
            {
                path: "",
                redirect: { name: "dashboard" },
            },
            {
                path: "dashboard",
                name: "dashboard",
                component: () =>
                    import("@/modules/home/views/DashboardView.vue"),
            },
            {
                path: "role",
                name: "role",
                component: () =>
                    import("@/modules/role/views/RoleView.vue"),
            },
            {
                path: "pegawai",
                name: "pegawai",
                component: () =>
                    import("@/modules/pegawai/views/PegawaiView.vue"),
            },
            {
                path: "users",
                name: "users",
                component: () =>
                    import("@/modules/users/views/UsersView.vue"),
            },
            {
                path: "driver",
                name: "driver",
                component: () =>
                    import("@/modules/driver/views/DriverView.vue"),
            },
            {
                path: "suplier",
                name: "suplier",
                component: () =>
                    import("@/modules/suplier/views/SuplierView.vue"),
            },
            {
                path: "kendaraan",
                name: "kendaraan",
                component: () =>
                    import("@/modules/kendaraan/views/KendaraanView.vue"),
            },
            {
                path: "kategori",
                name: "kategori",
                component: () =>
                    import("@/modules/kategori/views/KategoriView.vue"),
            },
            {
                path: "material",
                name: "material",
                component: () =>
                    import("@/modules/material/views/MaterialView.vue"),
            },
            // Tambahkan rute modular lainnya di sini
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Kasus 1: User sudah login tapi mencoba akses halaman Login (/)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/dashboard')
  }
  // Kasus 2: User belum login tapi mencoba akses halaman internal (Dashboard/Role)
  else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  }
  // Kasus lainnya: Bebas akses
  else {
    next()
  }
})
export default router;
