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
            <div class="text-h3 text-error">32</div>
            <div class="text-caption">Maximum HP</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> d10 + 2 (Con)
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4" variant="outlined">
          <v-card-title class="text-center">🛡️ Armor Class</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-blue">13</div>
            <div class="text-caption">AC</div>
            <div class="text-body-2 mt-2">
              <strong>Base:</strong> 10 + 3 (Dex)
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="purple-lighten-4" variant="outlined">
          <v-card-title class="text-center">⚖️ Proficiency</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h3 text-purple">+2</div>
            <div class="text-caption">Bonus</div>
            <div class="text-body-2 mt-2">
              Added to proficient skills
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skills Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="green">mdi-brain</v-icon>
        Skill Proficiencies
        <v-spacer />
        <v-chip color="green" size="small" variant="tonal">
          6 Skills
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Skills your character has learned and can perform well
      </v-card-subtitle>

      <v-card-text>
        <!-- Background Skills -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon color="orange" size="small">mdi-briefcase</v-icon>
            From Your Background (Folk Hero)
          </h4>
          <div class="d-flex flex-wrap ga-2">
            <v-chip color="orange" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Animal Handling
            </v-chip>
            <v-chip color="orange" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Survival
            </v-chip>
          </div>
        </div>

        <!-- Class Skills -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon color="primary" size="small">mdi-school</v-icon>
            From Your Class (Fighter)
          </h4>
          <div class="d-flex flex-wrap ga-2">
            <v-chip color="primary" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Athletics
            </v-chip>
            <v-chip color="primary" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Intimidation
            </v-chip>
            <v-chip color="primary" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Perception
            </v-chip>
          </div>
        </div>

        <!-- All Skills Summary -->
        <v-expansion-panels class="mt-4" variant="accordion">
          <v-expansion-panel title="View All Skills & Bonuses">
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-card class="skill-card" variant="tonal">
                    <v-card-text class="pa-3">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-medium">Athletics</div>
                          <div class="text-caption text-medium-emphasis">Strength based</div>
                        </div>
                        <v-chip color="success" size="small">+5</v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-card class="skill-card" variant="tonal">
                    <v-card-text class="pa-3">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-medium">Animal Handling</div>
                          <div class="text-caption text-medium-emphasis">Wisdom based</div>
                        </div>
                        <v-chip color="success" size="small">+4</v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-card class="skill-card" variant="tonal">
                    <v-card-text class="pa-3">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-medium">Intimidation</div>
                          <div class="text-caption text-medium-emphasis">Charisma based</div>
                        </div>
                        <v-chip color="success" size="small">+3</v-chip>
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
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="amber">mdi-tools</v-icon>
        Tool Proficiencies
        <v-spacer />
        <v-chip color="info" size="small" variant="tonal">Knowledge</v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Tools and equipment your character knows how to use effectively
      </v-card-subtitle>

      <v-card-text>
        <!-- Background Tool Proficiencies -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">
            <v-icon color="orange" size="small">mdi-briefcase</v-icon>
            From Your Background
          </h4>
          <div class="d-flex flex-wrap ga-2">
            <v-chip color="orange" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Smith's tools
            </v-chip>
            <v-chip color="orange" size="small" variant="tonal">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Vehicles (land)
            </v-chip>
          </div>
        </div>

        <v-alert class="mt-4" type="info" variant="tonal">
          <v-icon>mdi-information</v-icon>
          <strong>What this means:</strong> You know how to use these tools effectively,
          adding your proficiency bonus to relevant checks. You'll need to acquire the
          physical tools separately in your equipment.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Other Proficiencies Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="indigo">mdi-music</v-icon>
        Other Proficiencies
        <v-spacer />
        <v-chip color="info" size="small" variant="tonal">Knowledge</v-chip>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Musical Instruments -->
          <v-col cols="12" md="6">
            <v-card color="purple" variant="tonal">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-music</v-icon>
                Musical Instruments
              </v-card-title>
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  You can play these instruments skillfully
                </div>
                <v-chip class="mr-2" color="purple" size="small" variant="elevated">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  Lute
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Gaming Sets -->
          <v-col cols="12" md="6">
            <v-card color="green" variant="tonal">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-dice-multiple</v-icon>
                Gaming Sets
              </v-card-title>
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  Games you know how to play well
                </div>
                <v-chip color="green" size="small" variant="elevated">
                  <v-icon size="x-small" start>mdi-brain</v-icon>
                  Dice set
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Vehicles -->
        <v-card class="mt-4" color="blue" variant="tonal">
          <v-card-title class="text-subtitle-1">
            <v-icon class="mr-2">mdi-car</v-icon>
            Vehicle Proficiencies
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-3">
              Types of vehicles you can operate effectively
            </div>
            <v-chip color="blue" size="small" variant="elevated">
              <v-icon size="x-small" start>mdi-brain</v-icon>
              Vehicles (land)
            </v-chip>
            <div class="text-caption mt-2 text-medium-emphasis">
              <strong>Land vehicles:</strong> Carts, carriages, chariots, sleds, wagons
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Languages Section -->
    <v-card class="mb-6" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="teal">mdi-translate</v-icon>
        Languages
        <v-spacer />
        <v-chip color="teal" size="small" variant="tonal">Communication</v-chip>
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        Languages your character can speak and understand
      </v-card-subtitle>

      <v-card-text>
        <div class="d-flex flex-wrap ga-2">
          <v-chip color="teal" size="small" variant="tonal">
            <v-icon size="x-small" start>mdi-translate</v-icon>
            Common
          </v-chip>
          <v-chip color="teal" size="small" variant="tonal">
            <v-icon size="x-small" start>mdi-translate</v-icon>
            Dwarvish
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
// Mockup with sample data
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
