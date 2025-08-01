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
  },
  {
    path: "/character-form",
    name: "CharacterForm",
    component: CharacterForm,
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

// Removed navigation guard; access control is now handled by the overlay dialog in the page/component.

export default router;
