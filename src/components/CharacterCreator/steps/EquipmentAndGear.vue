<template>
  <v-card flat>
    <v-card-title class="text-h4 text-center mb-4">⚔️ Equipment & Gear</v-card-title>
    <v-card-subtitle class="text-center mb-6">
      Equip your character for adventure and combat readiness
    </v-card-subtitle>
    <v-card-text>
      <!-- Equipment Cards -->
      <v-row class="mb-4">
        <v-col cols="12" lg="6">
          <v-card class="equipment-category-card weapons-card">
            <v-card-title class="equipment-category-header-compact">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="me-2" size="small">mdi-sword</v-icon>
                  Weapons
                </div>
                <v-btn
                  color="primary"
                  density="comfortable"
                  icon
                  size="small"
                  variant="plain"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-list density="comfortable" lines="one">
                <v-list-item v-for="(weapon, index) in character.weapons || []" :key="index">
                  <v-list-item-title>
                    {{ weapon.name }}
                  </v-list-item-title>
                  <template #append>
                    <v-btn
                      color="error"
                      icon
                      size="x-small"
                      variant="plain"
                      @click="removeWeapon(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
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

  function removeWeapon (index) {
  // Implementation
  }
</script>

<style scoped>
.equipment-category-header-compact {
  padding: 8px 16px;
}
</style>
