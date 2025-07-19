<template>
 <div>
  <h1 class="mt-3" style="text-align: center;">Create your Character</h1>
  <p class="mt-2" style="text-align: center;">Choose wisely...</p>
  <v-container>
   <v-row style="justify-content: center;">
    <v-col cols="10">
     <v-card class="mt-3" min-height="50vh">
      <v-card-title class="text-h5 bg-red">🧝‍♀️ DnD Character Creator</v-card-title>
      <v-divider />
      <v-card-text class="py-4">
       <v-form v-model="valid" ref="form" lazy-validation>
        <v-expansion-panels multiple>
         <!-- Basic Info -->
         <v-expansion-panel>
          <v-expansion-panel-title>Basic Info</v-expansion-panel-title>
          <v-expansion-panel-text>
           <v-row>
            <v-col cols="6">
             <v-text-field v-model="character.name" label="Name" prepend-icon="mdi-account" variant="outlined"
              density="comfortable" />
            </v-col>
            <v-col cols="6">
             <v-text-field v-model="character.level" label="Level" prepend-icon="mdi-poll" type="number" min="1"
              max="20" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="6" md="3">
             <v-text-field v-model="character.race" label="Race" prepend-icon="mdi-dna" variant="outlined"
              density="comfortable" />
            </v-col>
            <v-col cols="6" md="3">
             <v-text-field v-model="character.class" label="Class" prepend-icon="mdi-sword" variant="outlined"
              density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
             <v-select v-model="character.alignment" :items="alignments" label="Alignment"
              prepend-icon="mdi-format-horizontal-align-center" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12">
             <v-textarea v-model="character.background" label="Background" prepend-icon="mdi-book-open-variant"
              variant="outlined" density="comfortable" rows="2" auto-grow />
            </v-col>

           </v-row>
          </v-expansion-panel-text>
         </v-expansion-panel>
         <!-- Ability Scores -->
         <v-expansion-panel>
          <v-expansion-panel-title>Ability Scores</v-expansion-panel-title>
          <v-expansion-panel-text>
           <!-- Rolled stats & buttons -->
           <v-row align="center" class="mb-2">
            <v-col cols="12" sm="8">
             <div>
              <strong>Rolled Values: </strong>
              <span style="font-size: x-large;" v-if="rolledStats.length && !rolling">
               | {{ rolledStats.join(' | ') }} |
              </span>
              <span v-else-if="rolling" class="text-grey">
               Rolling dice...
              </span>
              <span v-else class="text-grey">
               Click "Roll Stats" to begin.
              </span>
             </div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right">
             <v-btn color="green-darken-2" @click="() => rollStats(false)"
              :disabled="rolling || rolledStats.length > 0">
              🎲 Roll Stats
             </v-btn>
             <v-tooltip text="You only get 1 reroll">
              <template v-slot:activator="{ props }">
               <v-btn v-bind="props" class="ml-2" color="red-darken-2" @click="() => rollStats(true)"
                :disabled="rolling || timesRerolled === 1 || !rolledStats.length">
                🔁 Reroll
               </v-btn>
              </template>
             </v-tooltip>
            </v-col>
           </v-row>
           <!-- Rolling animation -->
           <v-row justify="center" v-if="rolling">
            <v-col cols="12" class="text-center">
             <v-progress-circular indeterminate color="deep-purple-accent-4" size="50" width="6" />
             <div class="mt-2">Rolling 4d6 for each stat...</div>
            </v-col>
           </v-row>
           <!-- Assign rolled stats -->
           <v-row dense v-if="rolledStats.length && !rolling">
            <v-col v-for="(value, stat) in character.stats" :key="stat" cols="12" md="4">
             <v-select v-model="character.stats[stat]" :items="getAvailableStatOptions(stat)"
              :label="stat.toUpperCase()" variant="outlined" density="comfortable" />
            </v-col>
           </v-row>
          </v-expansion-panel-text>
         </v-expansion-panel>
         <!-- Features and Proficiencies -->
         <v-expansion-panel>
          <v-expansion-panel-title>Features & Proficiencies</v-expansion-panel-title>
          <v-expansion-panel-text>
           <v-row dense>
            <v-col cols="12" md="6">
             <v-textarea v-model="character.features" label="Features & Traits" rows="4" variant="outlined"
              density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
             <v-textarea v-model="character.proficiencies" label="Proficiencies & Languages" rows="4" variant="outlined"
              density="comfortable" />
            </v-col>
           </v-row>
          </v-expansion-panel-text>
         </v-expansion-panel>
         <!-- Equipment and Spells -->
         <v-expansion-panel>
          <v-expansion-panel-title>Equipment & Spells</v-expansion-panel-title>
          <v-expansion-panel-text>
           <v-row dense>
            <v-col cols="12" md="6">
             <v-textarea v-model="character.equipment" label="Equipment" rows="3" variant="outlined"
              density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
             <v-textarea v-model="character.spells" label="Spells" rows="3" variant="outlined" density="comfortable" />
            </v-col>
           </v-row>
          </v-expansion-panel-text>
         </v-expansion-panel>
         <!-- Notes -->
         <v-expansion-panel>
          <v-expansion-panel-title>Notes</v-expansion-panel-title>
          <v-expansion-panel-text>
           <v-textarea v-model="character.notes" label="Miscellaneous Notes" rows="3" variant="outlined"
            density="comfortable" />
          </v-expansion-panel-text>
         </v-expansion-panel>
        </v-expansion-panels>
        <!-- Buttons -->
        <v-divider class="mt-5" />
        <v-row class="pt-3" justify="end">
         <v-btn class="mx-2 my-3 text-black" color="green" @click="submit" :disabled="!valid">Submit</v-btn>
         <v-btn class="mx-2 my-3 me-10" color="red" to="/">Back</v-btn>
        </v-row>
       </v-form>
      </v-card-text>
     </v-card>
    </v-col>
   </v-row>
  </v-container>
 </div>

</template>

<script setup>
import { ref, reactive } from 'vue'

const valid = ref(false)

const alignments = [
 'Lawful Good', 'Neutral Good', 'Chaotic Good',
 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
]

const character = reactive({
 name: '',
 race: '',
 class: '',
 level: 1,
 background: '',
 alignment: '',
 stats: {
  str: null,
  dex: null,
  con: null,
  int: null,
  wis: null,
  cha: null
 },
 features: '',
 proficiencies: '',
 equipment: '',
 spells: '',
 notes: ''
})

const rolledStats = ref([])
const timesRerolled = ref(0)
const rolling = ref(false)

function delay(ms) {
 return new Promise((res) => setTimeout(res, ms))
}

async function rollStats(isReroll = false) {
 if (rolling.value || (isReroll && timesRerolled.value)) return

 if (isReroll) timesRerolled.value = 1

 rolledStats.value = []
 rolling.value = true
 const newRolls = []

 for (let i = 0; i < 6; i++) {
  await delay(200)
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  rolls.sort((a, b) => b - a)
  const stat = rolls.slice(0, 3).reduce((sum, val) => sum + val, 0)
  newRolls.push(stat)
 }

 rolledStats.value = newRolls.sort((a, b) => b - a)

 // Reset stat assignments
 Object.keys(character.stats).forEach((key) => {
  character.stats[key] = null
 })

 rolling.value = false
}

function getAvailableStatOptions(currentKey) {
 const used = Object.entries(character.stats)
  .filter(([k, v]) => k !== currentKey && v !== null)
  .map(([_, v]) => v)

 return rolledStats.value.filter((val) => {
  const countRolled = rolledStats.value.filter((x) => x === val).length
  const countUsed = used.filter((x) => x === val).length
  return countUsed < countRolled
 })
}

function submit() {
 if (valid.value) {
  console.log('Character submitted:', JSON.stringify(character, null, 2))
  alert('Character submitted! Check console.')
 }
}

</script>

<style scoped>
.v-card-title {
 background-color: #eee;
 font-weight: bold;
}
</style>
