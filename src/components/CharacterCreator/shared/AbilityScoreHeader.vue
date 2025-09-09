<template>
  <div class="ability-score-header mb-4">
    <v-row align="start" class="mb-1" justify="space-between" no-gutters>
      <!-- Quick Start Options -->
      <v-col
        class="d-flex justify-start mb-3
mb-lg-0 pe-1 pe-lg-0"
        cols="6"
        lg="3"
        md="3"
        order="1"
        order-lg="1"
        order-md="1"
        xl="3"
      >
        <v-card class="compact-card w-100" color="primary-lighten-5" variant="tonal">
          <v-card-title class="text-subtitle-1 d-flex align-center pa-2">
            <v-icon class="me-1" size="small">mdi-lightning-bolt</v-icon>
            Quick Start
          </v-card-title>
          <v-card-text class="pa-3">
            <div class="tips-content">
              <div class="text-caption mb-4 indent-1">
                <strong>Quick Setup Options</strong>
              </div>
              <div class="d-flex justify-center mb-2">
                <v-btn
                  class="px-3 quick-start-btn"
                  color="primary"
                  prepend-icon="mdi-format-list-numbered"
                  size="small"
                  variant="elevated"
                  @click="$emit('set-standard-array')"
                >
                  Standard Array
                </v-btn>
              </div>
              <div class="d-flex justify-center mb-4">
                <v-btn
                  class="px-3 quick-start-btn"
                  color="secondary"
                  prepend-icon="mdi-dice-6"
                  size="small"
                  variant="elevated"
                  @click="$emit('roll-ability-scores')"
                >
                  Roll 4d6
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Title -->
      <v-col
        class="text-center mb-3 mb-lg-0
mt-4 mt-md-0"
        cols="12"
        lg="6"
        md="6"
        order="3"
        order-lg="2"
        order-md="2"
        xl="6"
      >
        <h2 class="text-h4 text-lg-h4 text-md-h5 text-h6 mb-2 mt-6">⚡ Set Your Abilities</h2>
        <p class="text-subtitle-1 text-grey">
          These numbers determine your character's basic capabilities
        </p>
      </v-col>

      <!-- Class Tips -->
      <v-col
        class="d-flex justify-end mb-3
mb-lg-0 ps-1 ps-lg-0"
        cols="6"
        lg="3"
        md="3"
        order="2"
        order-lg="3"
        order-md="3"
        xl="3"
      >
        <class-ability-tips :character="character" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import ClassAbilityTips from './ClassAbilityTips.vue'

  defineProps({
    character: {
      type: Object,
      required: true,
    },
  })

  defineEmits(['set-standard-array', 'roll-ability-scores'])
</script>

<style scoped>
.compact-card {
  transition: all 0.3s ease;
}

.tips-content {
  min-height: 120px;
}

.quick-start-btn {
  width: 80%;
}

/* Indent utility for headings */
.indent-1 {
  margin-left: 2em;
}
</style>
