<template>
  <v-dialog v-model="showAccessDialog" max-width="500">
    <v-card class="access-control-card">
      <v-card-title class="d-flex align-center justify-center pa-6 bg-gradient">
        <v-icon color="primary" size="large" class="me-3">mdi-shield-account</v-icon>
        <span class="text-h5 font-weight-bold">Access Required</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-alert type="info" variant="tonal" class="mb-4">
          <v-alert-title class="d-flex align-center">
            <v-icon class="me-2">mdi-account-group</v-icon>
            Private D&D Group
          </v-alert-title>
          This character creator is private and intended for a specific D&D group. Please enter the access code provided
          by your Dungeon Master to continue.
        </v-alert>

        <form id="access-form" @submit="handleFormSubmit" method="post" action="data:text/plain,success">
          <!-- Hidden username field for browser autofill recognition -->
          <input type="text" name="username" value="dnd-group-member" autocomplete="username" style="display: none;"
            aria-hidden="true" />

          <!-- Native password input for better browser recognition -->
          <div class="mb-3">
            <label for="access-password" class="text-body-2 text-grey mb-2 d-block">Access Code</label>
            <input id="access-password" v-model="accessPasswordInput" type="password" name="password"
              autocomplete="current-password" placeholder="Enter access code" class="v-input native-password-input"
              :class="{ 'error': accessError }" autofocus />
            <div v-if="accessError" class="text-error text-caption mt-1">{{ accessError }}</div>
            <div class="text-caption text-grey mt-1">Get this code from your DM</div>
          </div>

          <div class="text-caption text-grey mb-4">
            <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
            Access will last for 2 hours of activity
          </div>
        </form>

        <v-alert type="warning" variant="tonal" density="compact" class="mb-4">
          <div class="text-caption">
            <strong>Don't have an access code?</strong> This app is for invited players only.
            Contact the DM if you should have access.
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-btn variant="outlined" @click="closeAccessDialog" prepend-icon="mdi-close" class="flex-grow-1">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="elevated" type="submit" form="access-form" prepend-icon="mdi-check"
          class="flex-grow-1 ml-3" :disabled="!accessPasswordInput.trim()">
          Enter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { useAccessControlSingleton } from '@/composables/useAccessControl'

const accessControl = useAccessControlSingleton()
const showAccessDialog = accessControl.showAccessDialog
const accessPasswordInput = accessControl.accessPasswordInput
const accessError = accessControl.accessError
const handleAccessSubmit = accessControl.handleAccessSubmit
const closeAccessDialog = accessControl.closeAccessDialog
const hasAccess = accessControl.hasAccess

watch(() => hasAccess.value, (val) => {
  if (val) {
    closeAccessDialog()
  }
}, { immediate: true })

// Handle form submission to trigger browser password save
const handleFormSubmit = (event) => {
  // Don't prevent the default immediately - let the browser see the submission

  if (!accessPasswordInput.value.trim()) {
    event.preventDefault()
    return
  }

  const success = handleAccessSubmit()

  if (success) {
    // Create an iframe to submit the form to, avoiding page navigation
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.name = 'password-save-frame'
    document.body.appendChild(iframe)

    // Update form target to the iframe
    const form = event.target
    form.target = 'password-save-frame'

    // Clean up after a brief delay
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 1000)
    // Explicitly close the dialog after successful access
    closeAccessDialog()
  } else {
    event.preventDefault()
  }
}
</script>

<style scoped>
.access-control-card {
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
}

.bg-gradient {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary-lighten-5), 0.9), rgba(var(--v-theme-secondary-lighten-5), 0.8));
}

.native-password-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  font-size: 16px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  outline: none;
  transition: border-color 0.2s;
}

.native-password-input:focus {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.native-password-input.error {
  border-color: rgb(var(--v-theme-error));
}

.native-password-input::placeholder {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
