<template>
  <div>
    <h1 class="mt-3" style="text-align: center;">Home</h1>
    <p class="mt-2" style="text-align: center;">Welcome to your D&D Form!</p>
    <v-container style="text-align: center;">
      <v-row style="justify-content: center;">
        <v-col cols="10">
          <v-card class="mt-3" height="50vh">
            <v-card-title class="py-4" style="font-size: x-large; font-family: Verdana, Geneva, Tahoma, sans-serif;">Welcome!</v-card-title>
            <v-banner class="py-0 mx-auto" width="90%" />
            <v-card-text>
              <v-container class="mb-5 pt-5" style="font-size: large;" width="85%">
                ** Please make sure you are finished creating your player before submitting your form **
              </v-container>
              <v-btn color="red" size="large" to="/character-form">
                Create Character
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// This is your home page component
</script>
