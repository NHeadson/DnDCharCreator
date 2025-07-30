<template>
  <v-card class="mt-6" variant="outlined">
    <v-card-title class="text-h6">
      <v-icon start>mdi-information</v-icon>
      Ability Score Reference
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <h3 class="text-subtitle-1 mb-2">Score Meanings</h3>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>3-7: Severely Limited</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>8-9: Below Average</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>10-11: Average</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>12-13: Above Average</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>14-15: Gifted</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>16-17: Exceptional</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>18-20: Legendary</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="text-subtitle-1 mb-2">Quick Tips</h3>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>Most characters have at least one score of 14 or higher</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Standard Array: 15, 14, 13, 12, 10, 8</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Rolling: Roll 4d6, drop lowest, six times</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
