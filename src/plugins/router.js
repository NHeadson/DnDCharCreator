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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
