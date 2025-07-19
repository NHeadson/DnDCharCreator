<template>
  <v-app-bar app height="64" color="primary" dark>
    <v-toolbar-title>
      <router-link to="/" class="text-decoration-none text-white">
        D&D Character Creator
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn variant="text" to="/" class="text-none">
      Home
    </v-btn>

    <v-btn variant="text" to="/character-form" class="text-none">
      Create Character
    </v-btn>
  </v-app-bar>
</template>

<script setup>

</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
