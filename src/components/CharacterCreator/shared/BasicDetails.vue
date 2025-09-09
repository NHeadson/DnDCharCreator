<template>
  <v-card class="mb-6" variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" start>mdi-card-account-details</v-icon>
      Character Details
    </v-card-title>
    <v-card-text>
      <v-row>
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
            v-model="personalityText"
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
  // Fix for [object Object] showing in Personality Traits
  import { computed } from 'vue'
  const personalityText = computed({
    get () {
      if (typeof props.character.personality === 'string') return props.character.personality
      if (Array.isArray(props.character.personality)) return props.character.personality.join(', ')
      if (props.character.personality && typeof props.character.personality === 'object') {
        // If it's an object with traits, ideals, bonds, flaws
        const { traits = [], ideals = [], bonds = [], flaws = [] } = props.character.personality
        return [
          traits.length ? `Traits: ${traits.join(', ')}` : '',
          ideals.length ? `Ideals: ${ideals.join(', ')}` : '',
          bonds.length ? `Bonds: ${bonds.join(', ')}` : '',
          flaws.length ? `Flaws: ${flaws.join(', ')}` : '',
        ].filter(Boolean).join(' | ')
      }
      return ''
    },
    set (val) {
      props.character.personality = val
    },
  })
</script>
