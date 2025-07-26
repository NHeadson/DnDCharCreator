<template>
  <div class="theme-demo-page theme-background theme-aware pa-4">
    <v-container>
      <!-- Custom Theme Creator -->
      <v-row class="mb-6">
        <v-col cols="12" md="8" class="mx-auto" />
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" md="4" class="offset-md-0">
          <v-card class="pa-4 mb-4" max-width="480">
            <div class="d-flex align-center justify-space-between" style="cursor:pointer"
              @click="themeCreatorOpen = !themeCreatorOpen">
              <h3 class="mb-2">Theme Creator</h3>
              <v-icon>{{ themeCreatorOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>
            <v-expand-transition>
              <div v-show="themeCreatorOpen">
                <form @submit.prevent="handleCustomTheme">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="custom.primary" label="Primary Color" placeholder="#123456" required />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="custom.secondary" label="Secondary Color" placeholder="#654321" required />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="custom.accent" label="Accent Color" placeholder="#abcdef" required />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="custom.background" label="Background Color" placeholder="#f0f0f0"
                        required />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="custom.isDark" :items="darkLightOptions" label="Theme Mode" required />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="custom.name" label="Theme Name" placeholder="My Custom Theme" required />
                    </v-col>
                  </v-row>
                  <v-btn type="submit" color="primary" block>Create & Apply Theme</v-btn>
                </form>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <!-- Header -->
      <div class="page-header text-center mb-6">
        <h1 class="display-1 font-weight-bold theme-primary mb-2">🎨 Theme Demo</h1>
        <p class="text-h6 theme-text-secondary">Test the custom color palette themes</p>
        <v-divider class="mx-auto mt-4" style="max-width: 200px;" />
      </div>

      <!-- Theme Switcher -->
      <v-row class="mb-6">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 mb-4 theme-primary">Admin Theme Control</h2>
          <p class="text-subtitle-1 theme-text-secondary mb-4">
            Only admins can change the app theme. Theme persists across sessions.
          </p>
          <ThemeSwitcher />
        </v-col>
      </v-row>

      <!-- Color Palette Display -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h3 class="text-h5 mb-4 theme-primary">Current Color Palette</h3>
          <v-row>
            <v-col cols="6" md="3">
              <v-card class="themed-card pa-4 text-center">
                <div class="color-demo-box theme-primary-bg mb-3" style="height: 60px; border-radius: 8px;"></div>
                <h4 class="text-subtitle-1 font-weight-bold">Primary</h4>
                <p class="text-caption theme-text-secondary">Main brand color</p>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="themed-card pa-4 text-center">
                <div class="color-demo-box theme-secondary-bg mb-3" style="height: 60px; border-radius: 8px;"></div>
                <h4 class="text-subtitle-1 font-weight-bold">Secondary</h4>
                <p class="text-caption theme-text-secondary">Supporting color</p>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="themed-card pa-4 text-center">
                <div class="color-demo-box theme-accent-bg mb-3" style="height: 60px; border-radius: 8px;"></div>
                <h4 class="text-subtitle-1 font-weight-bold">Accent</h4>
                <p class="text-caption theme-text-secondary">Highlight color</p>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="themed-card pa-4 text-center">
                <div class="color-demo-box theme-surface mb-3"
                  style="height: 60px; border-radius: 8px; border: 2px solid var(--theme-border);"></div>
                <h4 class="text-subtitle-1 font-weight-bold">Surface</h4>
                <p class="text-caption theme-text-secondary">Card backgrounds</p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Component Examples -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h3 class="text-h5 mb-4 theme-primary">Component Examples</h3>
          <v-row>
            <!-- Buttons -->
            <v-col cols="12" md="6">
              <v-card class="themed-card pa-4">
                <h4 class="text-h6 mb-3 theme-primary">Buttons</h4>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn color="primary" variant="elevated" class="create-character-btn">Primary Button</v-btn>
                  <v-btn color="secondary" variant="outlined">Secondary Button</v-btn>
                  <v-btn color="accent" variant="tonal">Accent Button</v-btn>
                  <v-btn variant="text">Text Button</v-btn>
                </div>
              </v-card>
            </v-col>

            <!-- Cards -->
            <v-col cols="12" md="6">
              <v-card class="themed-card pa-4">
                <h4 class="text-h6 mb-3 theme-primary">Cards & Text</h4>
                <v-card class="ability-score-card pa-3 mb-2">
                  <h5 class="theme-primary">Primary Text</h5>
                  <p class="theme-text-secondary">Secondary text content</p>
                </v-card>
                <v-card class="equipment-card pa-3">
                  <h5 class="theme-accent">Accent Header</h5>
                  <p class="theme-text-primary">Primary text content</p>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Character Card Preview -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h3 class="text-h5 mb-4 theme-primary">Character Card Preview</h3>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-card class="character-card h-100" elevation="4" hover>
                <!-- Character Header with Background -->
                <div class="character-header pa-3">
                  <div class="character-overlay">
                    <div class="d-flex align-center mb-2">
                      <v-avatar size="48" color="white" class="me-3 elevation-2">
                        <v-icon size="32" color="primary">mdi-sword</v-icon>
                      </v-avatar>
                      <div class="character-title">
                        <h3 class="text-h5 font-weight-bold text-white mb-0">Sample Character</h3>
                        <p class="text-subtitle-2 text-white opacity-90 mb-0">Test Player</p>
                      </div>
                    </div>
                    <div class="character-subtitle">
                      <v-chip color="rgba(255,255,255,0.9)" size="small" class="me-2" dark>Level 5</v-chip>
                      <v-chip color="rgba(255,255,255,0.8)" size="small" variant="outlined" dark>Fighter</v-chip>
                    </div>
                  </div>
                </div>

                <!-- Character Details -->
                <v-card-text class="pa-3">
                  <div class="character-info mb-3">
                    <v-row dense>
                      <v-col cols="6">
                        <v-card variant="tonal" color="blue-lighten-5" class="pa-2 mb-2">
                          <div class="d-flex align-center">
                            <v-icon color="blue-darken-2" size="small" class="me-2">mdi-dna</v-icon>
                            <div>
                              <div class="text-caption text-blue-darken-2 font-weight-bold">Species</div>
                              <div class="text-body-2 font-weight-medium">Human</div>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="tonal" color="green-lighten-5" class="pa-2">
                          <div class="d-flex align-center">
                            <v-icon color="green-darken-2" size="small" class="me-2">mdi-book-open-page-variant</v-icon>
                            <div>
                              <div class="text-caption text-green-darken-2 font-weight-bold">Background</div>
                              <div class="text-body-2 font-weight-medium">Soldier</div>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>

                <!-- Actions -->
                <v-card-actions class="pa-4 pt-0">
                  <v-btn variant="elevated" color="primary" block class="admin-action-btn">
                    <template #prepend>
                      <v-icon>mdi-pencil</v-icon>
                    </template>
                    Edit Character
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Theme Info -->
      <v-row>
        <v-col cols="12">
          <v-card class="themed-card pa-6">
            <h3 class="text-h5 mb-6 theme-primary">Theme Features</h3>
            <v-row>
              <v-col cols="12" md="6" class="mb-4 mb-md-0">
                <h4 class="text-h6 mb-3 theme-accent">✨ Available Themes</h4>
                <ul class="theme-text-secondary theme-features-list">
                  <li class="mb-2"><strong>Default D&D Red:</strong> Classic red and gold styling (Dark Mode)</li>
                  <li class="mb-2"><strong>Mystical Waters:</strong> Dark blue-gray theme</li>
                  <li class="mb-2"><strong>Elegant Sage:</strong> Sophisticated dark mode</li>
                  <li class="mb-2"><strong>Sage Light:</strong> Clean light theme</li>
                </ul>
              </v-col>
              <v-col cols="12" md="6">
                <h4 class="text-h6 mb-3 theme-accent">🛠️ Features</h4>
                <ul class="theme-text-secondary theme-features-list">
                  <li class="mb-2">Instant theme switching</li>
                  <li class="mb-2">Persistent across sessions</li>
                  <li class="mb-2">Admin-only control</li>
                  <li class="mb-2">Smooth transitions</li>
                  <li class="mb-2">Responsive design</li>
                </ul>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const themeCreatorOpen = ref(false);
// ...existing code...
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { useTheme } from '@/composables/useTheme.js';

const { setTheme, createCustomTheme } = useTheme();

const custom = ref({
  primary: '',
  secondary: '',
  accent: '',
  background: '',
  isDark: true,
  name: '',
});

const darkLightOptions = [
  { value: true, title: 'Dark' },
  { value: false, title: 'Light' },
];

function handleCustomTheme() {
  // Auto-add # if missing and validate
  ['primary', 'secondary', 'accent', 'background'].forEach((key) => {
    let val = custom.value[key];
    if (val && !val.startsWith('#')) {
      custom.value[key] = '#' + val.replace(/[^0-9A-Fa-f]/g, '');
    }
  });
  // Validate color codes (basic check)
  if (!/^#[0-9A-Fa-f]{6}$/.test(custom.value.primary) ||
    !/^#[0-9A-Fa-f]{6}$/.test(custom.value.secondary) ||
    !/^#[0-9A-Fa-f]{6}$/.test(custom.value.accent) ||
    !/^#[0-9A-Fa-f]{6}$/.test(custom.value.background)) {
    alert('Please enter valid 6-digit hex color codes (e.g. 123456 or #123456).');
    return;
  }
  const themeKey = createCustomTheme(custom.value.name, {
    primary: custom.value.primary,
    secondary: custom.value.secondary,
    accent: custom.value.accent,
    background: custom.value.background,
    surface: custom.value.background,
    isDark: custom.value.isDark,
  });
  setTheme(themeKey);
}
</script>

<style scoped>
.theme-demo-page {
  min-height: 100vh;
}

.color-demo-box {
  transition: transform 0.2s ease;
}

.color-demo-box:hover {
  transform: scale(1.05);
}

.character-overlay {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
}

.theme-features-list {
  line-height: 1.6;
  padding-left: 20px;
}

.theme-features-list li {
  margin-bottom: 8px;
}
</style>
