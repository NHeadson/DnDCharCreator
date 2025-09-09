<template>
  <v-container class="ability-score-grid-container" fluid>
    <v-row class="justify-center">
      <v-col
        v-for="stat in stats"
        :key="stat.name"
        class="d-flex justify-center"
        cols="6"
        lg="4"
        md="4"
        sm="4"
      >
        <v-card
          :class="['ability-card-enhanced', 'd-flex', 'flex-column', 'align-center']"
          :ripple="isAssigningScores"
          variant="outlined"
          @click="isAssigningScores ? $emit('assign-score', stat.key) : undefined"
        >
          <v-card-title
            class="d-flex justify-space-between align-center mb-2"
            :class="{ 'mobile-title': $vuetify.display.smAndDown }"
          >
            <span class="stat-title" :class="{ 'mobile-stat-title': $vuetify.display.smAndDown }">{{
              $vuetify.display.smAndDown ? stat.name.slice(0, 3).toUpperCase() : stat.name }}</span>
            <v-chip
              class="ml-2"
              :color="getModifierColor(character.abilityScores[stat.key]?.score)"
              :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
            >
              {{ getAbilityModifier(character.abilityScores[stat.key]?.score) }}
            </v-chip>
          </v-card-title>
          <v-card-text class="text-center px-0" :class="{ 'mobile-card-text': $vuetify.display.smAndDown }">
            <v-text-field
              v-if="!isAssigningScores"
              class="ability-score-input"
              hide-details
              inputmode="numeric"
              :model-value="character.abilityScores[stat.key]?.score || ''"
              pattern="^(1[0-9]|20|[1-9])$"
              type="text"
              @input="(e) => {
                // Ensure the ability score object exists
                if (!character.abilityScores[stat.key]) {
                  character.abilityScores[stat.key] = { score: 10, modifier: 0 };
                }
                let val = e.target.value.replace(/[^0-9]/g, '');
                if (val === '' || isNaN(Number(val))) {
                  character.abilityScores[stat.key].score = '';
                } else {
                  val = Number(val);
                  if (val < 1) val = 1;
                  if (val > 20) val = 20;
                  character.abilityScores[stat.key].score = val;
                  character.abilityScores[stat.key].modifier = Math.floor((val - 10) / 2);
                }
              }"
              @update:model-value="(val) => {
                // Ensure the ability score object exists
                if (!character.abilityScores[stat.key]) {
                  character.abilityScores[stat.key] = { score: 10, modifier: 0 };
                }
                character.abilityScores[stat.key].score = val;
              }"
            />
            <v-btn
              v-else
              class="ability-score-btn mx-2"
              :class="{ 'mobile-btn': $vuetify.display.smAndDown }"
              :color="isAssigningScores ? 'primary' : undefined"
              :disabled="!isAssigningScores"
              :size="$vuetify.display.smAndDown ? 'default' : 'large'"
              variant="flat"
              @dragover.prevent
              @drop="$emit('assign-score', stat.key)"
            >
              {{ character.abilityScores[stat.key]?.score || '—' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    isAssigningScores: {
      type: Boolean,
      default: false,
    },
    selectedScore: {
      type: Number,
      default: null,
    },
    availableScores: {
      type: Array,
      default: () => [],
    },
  })

  defineEmits(['assign-score'])

  const stats = [
    { name: 'Strength', key: 'strength' },
    { name: 'Dexterity', key: 'dexterity' },
    { name: 'Constitution', key: 'constitution' },
    { name: 'Intelligence', key: 'intelligence' },
    { name: 'Wisdom', key: 'wisdom' },
    { name: 'Charisma', key: 'charisma' },
  ]

  // Always treat ability score as a number for calculations
  const getNumericScore = score => {
    if (score === '' || score === null || score === undefined) return null;
    return typeof score === 'number' ? score : Number(score);
  }

  const getAbilityModifier = score => {
    const num = getNumericScore(score);
    if (num === null || isNaN(num)) return '—';
    const modifier = Math.floor((num - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : modifier.toString();
  }

  const getModifierColor = score => {
    const num = getNumericScore(score);
    if (num === null || isNaN(num)) return 'grey';
    const modifier = Math.floor((num - 10) / 2);
    return modifier >= 0 ? 'success' : 'error';
  }
</script>

<style scoped>
.ability-score-grid-container {
  padding-top: 12px;
  padding-bottom: 12px;
}

.ability-card-enhanced {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  padding: 10%;
  box-sizing: border-box;
}

.stat-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.ability-score-btn {
  min-width: 72px;
  min-height: 72px;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 18px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ability-score-input {
  min-width: 72px;
  min-height: 72px;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 18px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Hide number input spinners for all browsers */
.ability-score-input input[type=number]::-webkit-inner-spin-button,
.ability-score-input input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.ability-score-input input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .ability-score-grid-container {
    padding: 0 8px;
  }

  .ability-card-enhanced {
    min-width: 120px;
    min-height: 140px;
  }
}

@media (max-width: 600px) {
  .ability-score-grid-container {
    padding: 0 4px;
  }

  .ability-card-enhanced {
    min-width: 100px;
    min-height: 120px;
    padding: 12px 0;
  }

  .mobile-title {
    padding: 8px 12px 4px 12px;
    margin-bottom: 4px !important;
  }

  .mobile-stat-title {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .mobile-card-text {
    padding: 4px 8px 8px 8px;
  }

  .mobile-btn {
    min-width: 48px;
    height: 48px;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .ability-score-input {
    max-width: 80px;
  }

  .ability-score-input :deep(.v-field__input) {
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 8px 4px;
  }
}
</style>
