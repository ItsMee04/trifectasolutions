import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import LoginView from "../modules/auth/views/LoginView.vue";

const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
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
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(
        (record) => record.meta.requiresGuest,
    );

    // 1. Redirect jika sudah login
    if (requiresGuest && isAuthenticated) {
        return next({ name: "dashboard" });
    }

    // 2. Redirect jika belum login
    if (requiresAuth && !isAuthenticated) {
        return next({ name: "login" });
    }

    next();
});
export default router;
