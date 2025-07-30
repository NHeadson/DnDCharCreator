<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center py-2">
      <v-icon class="me-2" color="teal">mdi-medal</v-icon>
      Feats
    </v-card-title>
    <v-divider />
    <v-card-text class="pt-3">
      <div v-if="character.feats.length === 0" class="text-center py-4">
        <v-icon class="mb-2 text-grey-darken-1" size="48">mdi-medal-outline</v-icon>
        <div class="text-subtitle-2 text-grey-darken-1">No Feats Yet</div>
        <div class="text-caption text-grey mt-1">Feats are typically gained at certain levels or through variant human
          rules</div>
      </div>

      <v-row v-else>
        <v-col v-for="(feat, index) in character.feats" :key="index" cols="12" md="6">
          <v-card class="feat-card" color="teal-lighten-5" flat>
            <v-card-text class="pa-3">
              <div class="d-flex justify-between align-center mb-2">
                <div class="text-subtitle-2 font-weight-bold">{{ feat.name || 'Feat ' + (index + 1) }}</div>
                <v-btn @click="removeFeat(index)" color="teal" icon size="x-small" variant="text">
                  <v-icon size="small">mdi-close</v-icon>
                </v-btn>
              </div>

              <v-text-field v-model="feat.name" density="compact" label="Feat Name" variant="outlined" class="mb-2" />

              <v-textarea v-model="feat.description" density="compact" label="Feat Description" rows="3"
                variant="outlined" class="mb-2" />

              <v-text-field v-model="feat.source" density="compact" label="Source (e.g., PHB, XGE)"
                variant="outlined" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-btn @click="addFeat" class="mt-2" color="teal" prepend-icon="mdi-plus" variant="outlined">
        Add Feat
      </v-btn>

      <!-- Popular Feats Reference -->
      <v-expansion-panels class="mt-4" variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title class="text-subtitle-2">
            <v-icon class="me-2" color="teal" size="small">mdi-book-open</v-icon>
            Popular Feats Reference
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col v-for="feat in popularFeats" :key="feat.name" cols="12" sm="6" md="4">
                <v-card class="pa-2" color="grey-lighten-5" flat @click="addPopularFeat(feat)">
                  <div class="text-subtitle-2 font-weight-bold text-teal">{{ feat.name }}</div>
                  <div class="text-caption text-grey-darken-2">{{ feat.shortDesc }}</div>
                </v-card>
              </v-col>
            </v-row>
            <div class="text-caption text-grey mt-2">Click on a feat to add it to your character</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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
  }
})

// Initialize feats array if it doesn't exist
if (!props.character.feats) {
  props.character.feats = []
}

// Popular D&D 5e feats
const popularFeats = [
  {
    name: 'Alert',
    shortDesc: '+5 initiative, can\'t be surprised',
    description: 'You gain a +5 bonus to initiative. You can\'t be surprised while you are conscious. Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you.'
  },
  {
    name: 'Great Weapon Master',
    shortDesc: 'Heavy weapon expertise',
    description: 'You\'ve learned to put the weight of a weapon to your advantage. You can choose to take a -5 penalty to your attack roll. If you do so and the attack hits, you add +10 to the attack\'s damage.'
  },
  {
    name: 'Sharpshooter',
    shortDesc: 'Ranged weapon expertise',
    description: 'You have mastered ranged weapons and can make shots that others find impossible. You can choose to take a -5 penalty to your attack roll. If you do so and the attack hits, you add +10 to the attack\'s damage.'
  },
  {
    name: 'War Caster',
    shortDesc: 'Spellcasting in combat',
    description: 'You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.'
  },
  {
    name: 'Lucky',
    shortDesc: 'Reroll dice 3 times per day',
    description: 'You have inexplicable luck that seems to kick in at just the right moment. You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20.'
  },
  {
    name: 'Tough',
    shortDesc: '+2 HP per level',
    description: 'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.'
  },
  {
    name: 'Fey Touched',
    shortDesc: 'Misty step + enchantment/divination spell',
    description: 'You learn the misty step spell and one 1st-level spell of your choice from the divination or enchantment school of magic. You can cast each of these spells without expending a spell slot once per long rest.'
  },
  {
    name: 'Telekinetic',
    shortDesc: 'Mage hand + bonus action shove',
    description: 'You learn the mage hand cantrip if you don\'t already know it. As a bonus action, you can try to shove one creature within 30 feet of you that you can see or sense with mage hand.'
  }
]

const addFeat = () => {
  props.character.feats.push({
    name: '',
    description: '',
    source: ''
  })
}

const removeFeat = (index) => {
  props.character.feats.splice(index, 1)
}

const addPopularFeat = (feat) => {
  props.character.feats.push({
    name: feat.name,
    description: feat.description,
    source: 'PHB'
  })
}
</script>

<style scoped>
.feat-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.feat-card:hover {
  border-color: rgba(0, 150, 136, 0.3);
  box-shadow: 0 2px 4px rgba(0, 150, 136, 0.1);
}

:deep(.v-card) {
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.v-card:hover) {
  background-color: rgba(0, 150, 136, 0.05) !important;
}
</style>
