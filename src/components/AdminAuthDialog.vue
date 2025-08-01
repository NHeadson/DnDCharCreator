<template>
  <v-dialog v-model="showAccessDialog" max-width="500" persistent>
    <v-card class="admin-auth-card">
      <v-card-title class="d-flex align-center justify-center pa-6 bg-gradient">
        <v-icon class="me-3" color="primary" size="large">mdi-shield-key</v-icon>
        <span class="text-h5 font-weight-bold">Access Code Required</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-alert class="mb-4" type="info" variant="tonal">
          <v-alert-title class="d-flex align-center">
            <v-icon class="me-2">mdi-information</v-icon>
            Restricted Access
          </v-alert-title>
          Enter your group access code or admin password to continue.<br>
          <span v-if="accessType === 'admin'" class="text-success font-weight-bold">Admin privileges granted.</span>
          <span v-else-if="accessType === 'user'" class="text-primary font-weight-bold">Standard access granted.</span>
        </v-alert>

        <v-form @submit.prevent="handleAccessSubmit">
          <v-text-field v-model="accessPasswordInput" autofocus :error-messages="accessError" class="mb-3"
            label="Access Code or Admin Password" prepend-inner-icon="mdi-lock" type="password" variant="outlined"
            @keyup.enter="handleAccessSubmit" />

          <div class="text-caption text-grey mb-4">
            <v-icon class="me-1" size="small">mdi-clock-outline</v-icon>
            Access will expire after 2 hours (admin: 30 minutes)
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-btn class="flex-grow-1" prepend-icon="mdi-close" variant="outlined" @click="closeAccessDialog">
          Cancel
        </v-btn>
        <v-btn class="flex-grow-1 ml-3" color="primary" :disabled="!accessPasswordInput.trim()" prepend-icon="mdi-key"
          variant="elevated" @click="handleAccessSubmit">
          Authenticate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAdminStore } from '@/stores/adminStore'
import { storeToRefs } from 'pinia'

const adminStore = useAdminStore()
const {
  showAccessDialog,
  accessPasswordInput,
  accessError,
  accessType
} = storeToRefs(adminStore)

const handleAccessSubmit = () => {
  adminStore.handleAccessSubmit()
}
const closeAccessDialog = () => {
  adminStore.closeAccessDialog()
}
</script>

<style scoped>
.admin-auth-card {
  border: 2px solid rgba(var(--v-theme-warning), 0.3);
}

.bg-gradient {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning-lighten-5), 0.9), rgba(var(--v-theme-primary-lighten-5), 0.8));
}
</style>
