<script>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AccessControlDialog from '@/components/AccessControlDialog.vue';
import { useAccessControl } from '@/composables/useAccessControl';

export default {
  components: {
    AppFooter,
    AppHeader,
    AccessControlDialog,
  },
  setup() {
    const { initializeAccess } = useAccessControl();

    // Initialize access state from sessionStorage on app start
    initializeAccess();

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
