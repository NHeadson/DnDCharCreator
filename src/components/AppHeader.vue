<template>
  <v-app-bar app height="64" color="#822522" dark>
    <v-toolbar-title>
      <router-link to="/" class="text-decoration-none text-white">
        D&D Character Creator
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn variant="flat" color="orange" to="/" class="text-black">
      Home
    </v-btn>

    <v-btn variant="flat" color="orange" to="/character-form" class="text-black mx-3">
      Create Character
    </v-btn>

    <v-btn variant="flat" color="orange" to="/characters" class="text-black me-3">
      My Characters
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
