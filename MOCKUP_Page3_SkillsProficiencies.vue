<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">🧠 Skills & Proficiencies</v-card-title>
    <v-card-subtitle class="text-center mb-4">
      What your character knows how to do
    </v-card-subtitle>

    <!-- Quick Reference Stats -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card color="error-lighten-4" variant="outlined">
          <v-card-title class="text-center">❤️ Hit Points</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-error">{{ calculateHitPoints }}</div>
            <div class="text-caption">Maximum HP</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> {{ getClassHitDie }} + {{ getConModifier }} (Con)
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4" variant="outlined">
          <v-card-title class="text-center">🛡️ Armor Class</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-blue">{{ calculateArmorClass }}</div>
            <div class="text-caption">AC</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> 10 + {{ getDexModifier }} (Dex)
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="purple-lighten-4" variant="outlined">
          <v-card-title class="text-center">⚖️ Proficiency</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-purple">+{{ character.proficiencyBonus }}</div>
            <div class="text-caption">Bonus</div>
            <div class="text-body-2 mt-2">
              Added to proficient skills
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skills Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-2">mdi-brain</v-icon>
        Skill Proficiencies
        <v-spacer />
        <v-chip color="green" variant="tonal" size="small">
          {{ getAllSkillProficiencies.length }} Skills
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Skills your character has learned and can perform well
      </v-card-subtitle>

      <v-card-text>
        <!-- Class Skills -->
        <div v-if="hasClassSkillChoices" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="primary">mdi-school</v-icon>
            From Your Class
          </h4>
          <!-- Class skill selection interface -->
        </div>

        <!-- Background Skills -->
        <div v-if="character.backgroundDetails?.skill_proficiencies?.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="orange">mdi-briefcase</v-icon>
            From Your Background
          </h4>
          <div class="d-flex flex-wrap ga-2">
            <v-chip v-for="skill in character.backgroundDetails.skill_proficiencies" :key="skill.name" color="orange"
              variant="tonal" size="small">
              <v-icon start size="x-small">mdi-brain</v-icon>
              {{ skill.name }}
            </v-chip>
          </div>
        </div>

        <!-- Species Skills -->
        <div v-if="hasSpeciesSkillProficiencies" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="purple">mdi-dna</v-icon>
            From Your Species
          </h4>
          <!-- Species skill display -->
        </div>

        <!-- All Skills Summary -->
        <v-expansion-panels class="mt-4" variant="accordion">
          <v-expansion-panel title="View All Skills & Bonuses">
            <v-expansion-panel-text>
              <v-row>
                <v-col v-for="skill in getAllSkillProficiencies" :key="skill.name" cols="12" md="4" sm="6">
                  <v-card variant="tonal" class="skill-card">
                    <v-card-text class="pa-3">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-medium">{{ skill.name }}</div>
                          <div class="text-caption text-medium-emphasis">
                            {{ skill.ability_score.name }} based
                          </div>
                        </div>
                        <v-chip color="success" size="small">
                          +{{ skill.modifier }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <!-- Tool Proficiencies Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="amber" class="mr-2">mdi-tools</v-icon>
        Tool Proficiencies
        <v-spacer />
        <v-chip color="amber" variant="tonal" size="small">Knowledge</v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Tools and equipment your character knows how to use effectively
      </v-card-subtitle>

      <v-card-text>
        <!-- Background Tool Proficiencies -->
        <div v-if="backgroundToolProficiencies.length" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon size="small" color="orange">mdi-briefcase</v-icon>
            From Your Background
          </h4>
          <div class="d-flex flex-wrap ga-2">
            <v-chip v-for="tool in backgroundToolProficiencies" :key="tool" color="orange" variant="tonal" size="small">
              <v-icon start size="x-small">mdi-brain</v-icon>
              {{ tool }}
            </v-chip>
          </div>
        </div>

        <!-- Tool Proficiency Selections -->
        <div v-if="hasToolChoices">
          <!-- Tool choice interface moved from equipment page -->
        </div>

        <v-alert type="info" variant="tonal" class="mt-4">
          <v-icon>mdi-information</v-icon>
          <strong>What this means:</strong> You know how to use these tools effectively,
          adding your proficiency bonus to relevant checks. You'll need to acquire the
          physical tools separately in your equipment.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Other Proficiencies Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="indigo" class="mr-2">mdi-music</v-icon>
        Other Proficiencies
        <v-spacer />
        <v-chip color="indigo" variant="tonal" size="small">Knowledge</v-chip>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Musical Instruments -->
          <v-col cols="12" md="6">
            <v-card variant="tonal" color="purple">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-music</v-icon>
                Musical Instruments
              </v-card-title>
              <v-card-text>
                <!-- Instrument proficiency selections -->
                <div class="text-body-2 text-medium-emphasis mb-2">
                  You can play these instruments skillfully
                </div>
                <!-- Interface for selecting instrument proficiencies -->
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Gaming Sets -->
          <v-col cols="12" md="6">
            <v-card variant="tonal" color="green">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-dice-multiple</v-icon>
                Gaming Sets
              </v-card-title>
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-2">
                  Games you know how to play well
                </div>
                <!-- Interface for selecting gaming set proficiencies -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Vehicles -->
        <v-card variant="tonal" color="blue" class="mt-4">
          <v-card-title class="text-subtitle-1">
            <v-icon class="mr-2">mdi-car</v-icon>
            Vehicle Proficiencies
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-2">
              Types of vehicles you can operate effectively
            </div>
            <!-- Vehicle proficiency interface with clear explanations -->
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Languages Section -->
    <v-card variant="outlined" class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon color="teal" class="mr-2">mdi-translate</v-icon>
        Languages
        <v-spacer />
        <v-chip color="teal" variant="tonal" size="small">Communication</v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Languages your character can speak and understand
      </v-card-subtitle>

      <v-card-text>
        <!-- Language display and selection -->
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
// Component logic would go here
// This is a mockup showing the structure
</script>

<style scoped>
.skill-card {
  height: 100%;
}

.skill-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
