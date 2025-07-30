<template>
  <v-card class="mb-6" variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" start>mdi-card-account-details</v-icon>
      Character Details
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="character.age"
            density="comfortable"
            hide-details
            label="Age"
            min="1"
            type="number"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="character.alignment"
            density="comfortable"
            hide-details
            :items="alignments"
            label="Alignment"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="character.faith"
            density="comfortable"
            hide-details
            label="Faith/Religion"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="character.appearance"
            class="mb-3"
            hide-details
            label="Physical Appearance"
            rows="3"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="character.personality"
            hide-details
            label="Personality Traits"
            rows="3"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
    characterData: {
      type: Object,
      required: true,
    },
  })

  const alignments = [
    'Lawful Good',
    'Neutral Good',
    'Chaotic Good',
    'Lawful Neutral',
    'True Neutral',
    'Chaotic Neutral',
    'Lawful Evil',
    'Neutral Evil',
    'Chaotic Evil',
  ]
</script>
