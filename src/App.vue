<script setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useAdminStore } from '@/stores/adminStore'
import { useTheme } from '@/composables/useTheme.js'
import { computed, ref, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const adminStore = useAdminStore()
const { loadSavedTheme } = useTheme()
// Initialize access state from sessionStorage on app start
adminStore.loadAccessState()
// Initialize theme from localStorage on app start
loadSavedTheme()

// Global toast/snackbar handling
const notificationStore = useNotificationStore()
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('primary')
const snackbarTimeout = ref(3500)

const nextNotification = computed(() => notificationStore.notifications[0] || null)

watch(nextNotification, (notif) => {
  if (notif) {
    snackbarText.value = notif.message || ''
    snackbarColor.value = notif.type === 'error' ? 'error' : notif.type === 'success' ? 'success' : 'primary'
    snackbar.value = true
  }
})

const closeSnackbar = () => {
  snackbar.value = false
  // Remove the displayed notification from queue
  if (nextNotification.value) {
    notificationStore.removeNotification(0)
  }
}
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

    <!-- Global Toast -->
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" location="top right" variant="elevated">
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" icon="mdi-close" @click="closeSnackbar" />
      </template>
    </v-snackbar>
  </v-app>
</template>
