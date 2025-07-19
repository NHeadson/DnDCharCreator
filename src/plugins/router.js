/**
 * router/index.js
 *
 * Automatic routes for Vue Router
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'

// Pages
import CharacterForm from '@/pages/character-form.vue'
import Index from '@/pages/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/character-form',
    name: 'CharacterForm',
    component: CharacterForm,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
