<template>
  <div class="home-page">
    <v-container class="text-center">
      <h1 class="display-2 font-weight-bold mb-3">Welcome to the D&D Character Tool</h1>
      <p class="subheading-1">Create and manage your Dungeons & Dragons characters with ease.</p>
      <v-btn class="mt-5" color="primary" to="/characters">View Characters</v-btn>
    </v-container>
  </div>
</template>

<script setup>
// No script needed for this simple home page
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
