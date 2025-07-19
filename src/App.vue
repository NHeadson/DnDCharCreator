<script>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

export default {
  components: {
    AppFooter,
    AppHeader,
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
  </v-app>
</template>
