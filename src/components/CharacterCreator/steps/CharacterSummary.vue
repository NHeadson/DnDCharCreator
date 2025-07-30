<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-6 text-primary">
      📝 Final Review
    </v-card-title>
    <v-card-subtitle class="text-center mb-8 text-h6">
      Review your character and make any final adjustments
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="text-h6">Character Summary</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-h5 mb-4">{{ character.name || 'Unnamed Character' }}</div>
                  <div class="text-subtitle-1 mb-2">
                    Level {{ character.level }} {{ character.class || 'Unknown Class' }}
                  </div>
                  <div class="text-body-1 mb-2">
                    {{ character.species || 'Unknown Species' }} • {{ character.background || 'Unknown Background' }}
                  </div>
                  <div class="text-body-2 text-grey">
                    {{ character.alignment || 'Unaligned' }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
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
