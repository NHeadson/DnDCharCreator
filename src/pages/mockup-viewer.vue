<template>
  <div class="mockup-viewer pa-4">
    <v-card class="mb-4">
      <v-card-title>Design Mockup Viewer</v-card-title>
      <v-card-subtitle>Preview of redesigned pages 3 & 4</v-card-subtitle>
      <v-card-text>
        <v-btn-toggle v-model="currentMockup" variant="outlined" class="mb-4">
          <v-btn value="page3" prepend-icon="mdi-brain">
            Page 3: Skills & Proficiencies
          </v-btn>
          <v-btn value="page4" prepend-icon="mdi-bag-personal">
            Page 4: Inventory & Equipment
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>

    <!-- Page 3 Mockup -->
    <SkillsProficienciesMockup v-if="currentMockup === 'page3'" />

    <!-- Page 4 Mockup -->
    <InventoryEquipmentMockup v-if="currentMockup === 'page4'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SkillsProficienciesMockup from '@/components/Mockups/SkillsProficienciesMockup.vue'
import InventoryEquipmentMockup from '@/components/Mockups/InventoryEquipmentMockup.vue'

const currentMockup = ref('page3')
</script>

<style scoped>
.mockup-viewer {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
