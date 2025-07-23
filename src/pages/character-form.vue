<template>
  <div class="character-form-page">
    <!-- Show character creator if user has access -->
    <CharacterCreatorMain v-if="hasAccess" />

    <!-- Show access required message if no access -->
    <v-container v-else class="d-flex flex-column align-center justify-center" style="min-height: 80vh;">
      <v-card class="pa-8 text-center" max-width="600">
        <v-icon size="64" color="orange" class="mb-4">mdi-lock</v-icon>
        <h2 class="mb-4">Access Required</h2>
        <p class="mb-6 text-h6">
          This is a private D&D group's character creation tool.
          You need an access code to create characters.
        </p>
        <v-btn color="#822522" size="large" @click="requireAccessForCreation" class="mb-4">
          Enter Access Code
        </v-btn>
        <div class="mt-4">
          <v-btn variant="text" to="/" class="text-decoration-none">
            ← Back to Home
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import CharacterCreatorMain from '@/components/CharacterCreator/CharacterCreatorMain.vue'
import { useAccessControl } from '@/composables/useAccessControl'
import { useRouter } from 'vue-router'

const router = useRouter()
const { hasAccess, requireAccess } = useAccessControl()

const requireAccessForCreation = () => {
  requireAccess(() => {
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