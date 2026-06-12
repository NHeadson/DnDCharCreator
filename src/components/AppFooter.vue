<template>
  <v-footer app class="theme-surface-bg" height="40">
    <div class="d-none d-sm-inline-block mx-auto theme-secondary">Nick Headson &copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>
/* Use theme-surface-bg for a modern card-like footer background */
<script setup></script>

<style scoped>
.v-footer {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .v-footer {
    font-size: 0.8rem;
  }
}
</style>
