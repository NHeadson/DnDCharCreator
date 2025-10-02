<template>
  <v-dialog max-width="800px" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="portrait-selector-card">
      <v-card-title class="d-flex align-center">
        <span class="text-h5">Select a Portrait</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p v-if="!imagesAvailable" class="text-center pa-4 text-medium-emphasis">
          No default portraits found.<br>
          Please add images to the <code>public/assets/portraits/</code> directory.
        </p>
        <div v-else>
          <v-tabs v-model="currentRaceTab" align-tabs="center" class="mb-4" grow>
            <v-tab v-for="race in availableRaces" :key="race" class="text-capitalize" :value="race">{{ race }}</v-tab>
          </v-tabs>
          <v-window v-model="currentRaceTab">
            <v-window-item v-for="race in availableRaces" :key="race" :value="race">
              <v-row dense>
                <v-col v-for="gender in availableGenders(race)" :key="gender" cols="12">
                  <div class="text-subtitle-1 font-weight-bold mb-2 text-capitalize">{{ gender }}</div>
                  <v-row dense>
                    <v-col
                      v-for="portrait in portraits[race][gender]"
                      :key="portrait"
                      cols="4"
                      md="2"
                      sm="3"
                    >
                      <v-card class="portrait-item" flat hover @click="selectPortrait(portrait)">
                        <v-img :aspect-ratio="1" class="rounded-lg" cover :src="portrait">
                          <template #placeholder>
                            <div class="d-flex align-center justify-center fill-height grey-lighten-3">
                              <v-progress-circular color="grey-lighten-1" indeterminate />
                            </div>
                          </template>
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-divider v-if="gender === 'female' && availableGenders(race).includes('male')" class="my-4" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    characterRace: {
      type: String,
      default: null,
    },
  })

  const emit = defineEmits(['update:modelValue', 'select'])

  const RACES = ['dragonborn', 'dwarf', 'elf', 'gnome', 'half-elf', 'halfling', 'half-orc', 'human', 'tiefling'];
  const GENDERS = ['female', 'male'];
  const IMAGE_COUNT_PER_CATEGORY = 4;
  const currentRaceTab = ref(props.characterRace || RACES[0]);

  const portraits = computed(() => {
    const allPortraits = {};
    RACES.forEach(race => {
      allPortraits[race] = {};
      GENDERS.forEach(gender => {
        allPortraits[race][gender] = Array.from(
          { length: IMAGE_COUNT_PER_CATEGORY },
          (_, i) => `/assets/portraits/${race}/${gender}/${i + 1}.webp`
        );
      });
    });
    return allPortraits;
  });

  const availableRaces = computed(() => {
    if (props.characterRace && RACES.includes(props.characterRace)) {
      return [props.characterRace];
    }
    return RACES;
  });
  const imagesAvailable = computed(() => availableRaces.value.length > 0);

  function availableGenders (race) {
    return GENDERS.filter(gender => portraits.value[race]?.[gender]?.length > 0);
  }

  const selectPortrait = portraitUrl => {
    const race = availableRaces.value.find(r => portraitUrl.includes(`/${r}/`)) || currentRaceTab.value;
    emit('select', { url: portraitUrl, race });
    emit('update:modelValue', false)
  }
</script>

<style scoped>
.portrait-selector-card {
  border-radius: 16px;
}

.portrait-item {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 2px solid transparent;
}

.portrait-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.6);
}
</style>
