<script setup>
import AccessControlDialog from '@/components/AccessControlDialog.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useAdminStore } from '@/stores/adminStore'
import { useThemeStore } from '@/stores/themeStore'

const adminStore = useAdminStore()
const themeStore = useThemeStore()
// Initialize access state from sessionStorage on app start
adminStore.loadAccessState()
if (!adminStore.isAccessValid) {
  adminStore.showAccessDialog = true
}
// Initialize theme from localStorage on app start
themeStore.initThemes()
themeStore.loadSavedTheme()
</script>

<!-- HTML -->
<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />

    <!-- AccessControlDialog removed; only AdminAuthDialog in character-form.vue will be used for access control. -->
  </v-app>
</template>
