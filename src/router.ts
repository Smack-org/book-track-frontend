import { createRouter, createWebHistory } from "vue-router";
import SearchPage from "./pages/SearchPage.vue";
import RegistrationPage from "./pages/auth/RegistrationPage.vue";
import BookPage from "./pages/BookPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import LoginPage from "./pages/auth/LoginPage.vue";
import useAuthStore from "./stores/auth.store";
import ReadingListPage from "./pages/ReadingListPage.vue";
import FavoritesPage from "./pages/FavoritesPage.vue";
import Dashboard from "./pages/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/search" },
    {
      path: "/search",
      component: SearchPage,
      meta: { needsAuth: true },
      name: "search",
    },
    {
      path: "/reading-list",
      component: ReadingListPage,
      meta: { needsAuth: true },
      name: "reading-list",
    },
    {
      path: "/favorites",
      component: FavoritesPage,
      meta: { needsAuth: true },
      name: "favorites",
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: { needsAuth: true },
      name: "dashboard",
    },
    {
      path: "/auth/login",
      component: LoginPage,
      meta: { guestOnly: true },
      name: "login",
    },
    {
      path: "/auth/register",
      component: RegistrationPage,
      meta: { guestOnly: true },
      name: "register",
    },
    {
      path: "/book/:bookId(\\d+)",
      name: "book",
      component: BookPage,
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

  if (!authStore.initialized) {
    await authStore.initialize();
  }

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
