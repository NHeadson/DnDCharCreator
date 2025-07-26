<script>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AccessControlDialog from '@/components/AccessControlDialog.vue';
import { useAccessControlSingleton } from '@/composables/useAccessControl';
import { useTheme } from '@/composables/useTheme';

export default {
  components: {
    AppFooter,
    AppHeader,
    AccessControlDialog,
  },
  setup() {
    const accessControl = useAccessControlSingleton();
    const { loadSavedTheme } = useTheme();

    // Initialize access state from sessionStorage on app start
    accessControl.initializeAccess();

    // Initialize theme from localStorage on app start
    loadSavedTheme();

    return {};
  },
  data() {
    return {

    }
  }
};
</script>


<!-- HTML -->
<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />

    <!-- Global Access Control Dialog -->
    <AccessControlDialog />
  </v-app>
</template>
