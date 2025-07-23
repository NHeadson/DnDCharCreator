<template>
  <v-container fluid>
    <h1 class="mt-2 ml-2 ml-sm-5" style="text-align: center;">Welcome to the D&D Character Creation App</h1>
    <v-container class="pt-0 mt-0" style="text-align: center;">
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="my-16 pa-4 pa-sm-6 pa-md-10" max-height="50vh">
            <v-card-title
              style="font-size: x-large; font-family: Verdana, Geneva, Tahoma, sans-serif;">Welcome!</v-card-title>
            <v-banner class="py-4 mx-auto" width="90%" />
            <v-card-text class="py-4">
              <v-container style="font-size: large;" width="85%">
                ** Please make sure you are finished creating your player before submitting your form **
              </v-container>
              <v-btn color="#822522" size="large" to="/character-form" class="mt-4">
                Create Character
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
// This is your home page component
</script>
