<template>
  <div class="character-form-page character-creator theme-aware">
    <!-- Show character creator if user has access -->
    <CharacterCreatorMain v-if="isAccessValid" />

    <!-- Show access required message if no access -->
    <v-container v-else class="d-flex flex-column align-center justify-center" style="min-height: 80vh;">
      <v-card class="pa-8 text-center themed-card" max-width="600">
        <v-icon class="mb-4" color="orange" size="64">mdi-lock</v-icon>
        <h2 class="mb-4 theme-text-primary">Access Required</h2>
        <p class="mb-6 text-h6 theme-text-secondary">
          This is a private D&D group's character creation tool.
          You need an access code to create characters.
        </p>
        <v-btn class="mb-4 create-character-btn" color="primary" size="large" @click="requireAccessForCreation">
          Enter Access Code
        </v-btn>
        <div class="mt-4">
          <v-btn class="text-decoration-none" to="/" variant="text">
            ← Back to Home
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CharacterCreatorMain from '@/components/CharacterCreator/CharacterCreatorMain.vue'
import { useAdminStore } from '@/stores/adminStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const adminStore = useAdminStore()
const { isAccessValid } = storeToRefs(adminStore)

const requireAccessForCreation = () => {
  adminStore.requireAccess(() => {
    // Once access is granted, the component will re-render showing the character creator
  }, 'create a new character')
}
</script>

<style scoped>
.character-form-page {
  min-height: 100vh;
  padding: 20px 0;
}
</style>
