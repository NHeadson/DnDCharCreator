/**
 * router/index.js
 *
 * Automatic routes for Vue Router
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "@/stores/adminStore";

// Pages
import CharacterForm from "@/pages/character-form.vue";
import Characters from "@/pages/characters.vue";
import ThemeDemo from "@/pages/theme-demo.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: CharacterForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/character-form",
    name: "CharacterForm",
    component: CharacterForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/characters",
    name: "Characters",
    component: Characters,
  },
  {
    path: "/theme-demo",
    name: "ThemeDemo",
    component: ThemeDemo,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore();
  if (to.meta.requiresAuth && !adminStore.isAccessValid) {
    sessionStorage.setItem("redirectAfterLogin", to.fullPath);
    adminStore.requireAccess(() => {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        next(redirectPath);
      } else {
        next();
      }
    });
    return;
  }
  next();
});

export default router;
