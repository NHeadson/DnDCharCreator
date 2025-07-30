<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">📝 Character Information</v-card-title>
    <v-card-text>
      <character-header :character="character" :character-data="characterData" />

      <!-- Core Character Options -->
      <div class="selection-options">
        <species-selector :character="character" :character-data="characterData" />
        <class-selector :character="character" :character-data="characterData" />
        <background-selector :character="character" :character-data="characterData" />
      </div>

      <basic-details :character="character" :character-data="characterData" />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import BackgroundSelector from '../shared/BackgroundSelector.vue'
  import BasicDetails from '../shared/BasicDetails.vue'
  import CharacterHeader from '../shared/CharacterHeader.vue'
  import ClassSelector from '../shared/ClassSelector.vue'
  import SpeciesSelector from '../shared/SpeciesSelector.vue'

  defineProps({
    character: {
      type: Object,
      required: true,
    },
    characterData: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped>
.selection-options> :deep(*) {
  margin-bottom: 2rem;
}

/* Remove margin from the last selector */
.selection-options> :deep(*:last-child) {
  margin-bottom: 0;
}

/* Apply proper spacing between the cards */
.selection-options :deep(.v-row) {
  margin: 0;
}

.selection-options :deep(.v-col) {
  padding: 8px;
}
</style>
