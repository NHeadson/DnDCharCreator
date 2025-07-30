<template>
  <v-dialog v-model="showAuthDialog" max-width="500" persistent>
    <v-card class="admin-auth-card">
      <v-card-title class="d-flex align-center justify-center pa-6 bg-gradient">
        <v-icon class="me-3" color="warning" size="large">mdi-shield-key</v-icon>
        <span class="text-h5 font-weight-bold">Admin Authentication Required</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-alert class="mb-4" type="info" variant="tonal">
          <v-alert-title class="d-flex align-center">
            <v-icon class="me-2">mdi-information</v-icon>
            Restricted Access
          </v-alert-title>
          Only the Dungeon Master and authorized users can edit or delete characters. Please enter the admin password to
          continue.
        </v-alert>

        <v-form @submit.prevent="handleAuthSubmit">
          <v-text-field
            v-model="passwordInput"
            autofocus
            :error-messages="authError"
            class="mb-3"
            label="Admin Password"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="outlined"
            @keyup.enter="handleAuthSubmit"
          />

          <div class="text-caption text-grey mb-4">
            <v-icon class="me-1" size="small">mdi-clock-outline</v-icon>
            Access will expire after 30 minutes of inactivity
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-btn class="flex-grow-1" prepend-icon="mdi-close" variant="outlined" @click="closeAuthDialog">
          Cancel
        </v-btn>
        <v-btn
          class="flex-grow-1 ml-3"
          color="primary"
          :disabled="!passwordInput.trim()"
          prepend-icon="mdi-key"
          variant="elevated"
          @click="handleAuthSubmit"
        >
          Authenticate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useAdminAuth } from '@/composables/useAdminAuth'

  const {
    showAuthDialog,
    passwordInput,
    authError,
    handleAuthSubmit,
    closeAuthDialog,
  } = useAdminAuth()
</script>

<style scoped>
.admin-auth-card {
  border: 2px solid rgba(var(--v-theme-warning), 0.3);
}

.bg-gradient {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning-lighten-5), 0.9), rgba(var(--v-theme-primary-lighten-5), 0.8));
}
</style>
