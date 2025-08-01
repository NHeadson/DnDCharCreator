<template>
  <div class="character-form-page character-creator theme-aware">
    <!-- Always show character creator -->
    <CharacterCreatorMain />
    <!-- Overlay access dialog if access is not valid -->
    <AdminAuthDialog v-if="!isAccessValid" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CharacterCreatorMain from '@/components/CharacterCreator/CharacterCreatorMain.vue'
import AdminAuthDialog from '@/components/AdminAuthDialog.vue'
import { useAdminStore } from '@/stores/adminStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const adminStore = useAdminStore()
const { isAccessValid } = storeToRefs(adminStore)
</script>

<style scoped>
.character-form-page {
  min-height: 100vh;
  padding: 20px 0;
}
</style>
