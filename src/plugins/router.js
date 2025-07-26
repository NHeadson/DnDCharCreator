/**
 * router/index.js
 *
 * Automatic routes for Vue Router
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";

// Pages
import CharacterForm from "@/pages/character-form.vue";
import Characters from "@/pages/characters.vue";
import Index from "@/pages/index.vue";
import ThemeDemo from "@/pages/theme-demo.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
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

export default router;
