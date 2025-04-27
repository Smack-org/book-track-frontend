import { createRouter, createWebHistory } from "vue-router";
import NotFoundPage from "./pages/NotFoundPage.vue";
import useAuthStore from "./stores/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/search" },
    {
      path: "/search",
      component: () => import("./pages/SearchPage.vue"),
      meta: { needsAuth: true },
      name: "search",
    },
    {
      path: "/reading-list",
      component: () => import("./pages/ReadingListPage.vue"),
      meta: { needsAuth: true },
      name: "reading-list",
    },
    {
      path: "/favorites",
      component: () => import("./pages/FavoritesPage.vue"),
      meta: { needsAuth: true },
      name: "favorites",
    },
    {
      path: "/dashboard",
      component: () => import("./pages/Dashboard.vue"),
      meta: { needsAuth: true },
      name: "dashboard",
    },
    {
      path: "/auth/login",
      component: () => import("./pages/auth/LoginPage.vue"),
      meta: { guestOnly: true },
      name: "login",
    },
    {
      path: "/auth/register",
      component: () => import("./pages/auth/RegistrationPage.vue"),
      meta: { guestOnly: true },
      name: "register",
    },
    {
      path: "/book/:bookId(\\d+)",
      name: "book",
      component: () => import("./pages/BookPage.vue"),
      props: (route) => ({
        bookId: Number(route.params.bookId),
      }),
      meta: { needsAuth: true },
    },
    { path: "/:catchAll(.*)", component: NotFoundPage },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { left: 0, top: 0 };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.needsAuth && !authStore.isAuthentificated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authStore.isAuthentificated) {
    return {
      name: "search",
    };
  }
});

export default router;
