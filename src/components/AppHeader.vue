<template>
  <v-app-bar app class="theme-primary-bg header-enhanced" elevation="4" :height="$vuetify.display.mobile ? 64 : 80">
    <v-toolbar-title class="header-title">
      <router-link class="text-decoration-none theme-text title-link" to="/">
        <v-icon class="title-icon" :class="$vuetify.display.mobile ? 'me-1' : 'me-2'" icon="mdi-dice-d20" />
        <span class="title-text">
          <span class="d-none title-full">D&D Character Tool</span>
          <span class="d-none title-medium">D&D Tool</span>
        </span>
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <!-- Desktop Navigation Buttons (hidden at 1117px and below) -->
    <div class="nav-buttons d-none nav-buttons-desktop">
      <v-btn
        class="nav-btn"
        :class="{ 'nav-btn--active': $route.path === '/' }"
        rounded="lg"
        :size="$vuetify.display.mobile ? 'small' : 'default'"
        to="/"
        variant="flat"
      >
        <v-icon :class="$vuetify.display.mobile ? '' : 'me-2'" icon="mdi-home" />
        <span class="d-none d-md-inline nav-text">Home</span>
      </v-btn>
      <v-btn
        class="nav-btn"
        :class="{ 'nav-btn--active': $route.path.startsWith('/characters') }"
        rounded="lg"
        :size="$vuetify.display.mobile ? 'small' : 'default'"
        to="/character-form"
        variant="flat"
      >
        <v-icon :class="$vuetify.display.mobile ? '' : 'me-2'" icon="mdi-account-group" />
        <span class="d-none d-md-inline nav-text">Create</span>
        <span class="d-none d-lg-inline nav-text"> Character</span>
      </v-btn>
      <v-btn
        v-if="adminStore.isAdminUser"
        class="nav-btn"
        :class="{ 'nav-btn--active': $route.path.startsWith('/theme') }"
        color="accent"
        rounded="lg"
        :size="$vuetify.display.mobile ? 'small' : 'default'"
        title="Theme Settings"
        to="/theme"
        variant="flat"
      >
        <v-icon :class="$vuetify.display.mobile ? '' : 'me-2'" icon="mdi-palette" />
        <span class="d-none d-md-inline nav-text">Theme</span>
      </v-btn>
    </div>

    <!-- Hamburger Menu Button (shown at 1117px and below) -->
    <v-btn class="hamburger-btn nav-buttons-mobile" icon variant="text" @click="drawer = !drawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Navigation Drawer for Mobile/Tablet -->
  <v-navigation-drawer
    v-model="drawer"
    app
    class="theme-primary-bg"
    location="right"
    temporary
  >
    <v-list class="nav-drawer-list">
      <v-list-item
        class="nav-drawer-item"
        :class="{ 'nav-drawer-item--active': $route.path === '/' }"
        prepend-icon="mdi-home"
        title="Home"
        to="/"
        @click="drawer = false"
      />

      <v-list-item
        class="nav-drawer-item"
        :class="{ 'nav-drawer-item--active': $route.path.startsWith('/characters') }"
        prepend-icon="mdi-account-group"
        title="Create Character"
        to="/character-form"
        @click="drawer = false"
      />

      <v-list-item
        v-if="adminStore.isAdminUser"
        class="nav-drawer-item"
        :class="{ 'nav-drawer-item--active': $route.path.startsWith('/theme') }"
        prepend-icon="mdi-palette"
        title="Theme Settings"
        to="/theme"
        @click="drawer = false"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAdminStore } from '@/stores/adminStore'

  const router = useRouter()
  const $route = useRoute()
  const adminStore = useAdminStore()

  // Drawer state for hamburger menu
  const drawer = ref(false)

  // Use isAuthenticated for admin-only UI
  const hasAccess = computed(() => adminStore.hasAccess)
  const requireAccessForCreation = () => {
    adminStore.requireAccess(() => {
      router.push('/character-form')
    }, 'create a new character')
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Quattrocento:wght@400;700&display=swap');

/* Nav button active state */
.nav-btn {
  background-color: var(--theme-secondary) !important;
  color: var(--theme-on-secondary, #1A1A1A) !important;
  opacity: 0.92;
  transition: background 0.2s, color 0.2s, opacity 0.2s;
  margin-right: 8px;
}

.nav-btn--active {
  background-color: var(--theme-secondary-darken-2, #bfa22e) !important;
  color: var(--theme-on-secondary, #1A1A1A) !important;
  opacity: 1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  z-index: 1;
}

.text-decoration-none {
  text-decoration: none;
}

.header-enhanced {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(10px);
  overflow: visible !important;
  /* Prevent clipping of animated elements */
}

.header-title {
  font-family: 'Cinzel', serif !important;
  font-weight: 600;
  font-size: 1.8rem !important;
  letter-spacing: 0.5px;
  overflow: visible !important;
  /* Allow dice animation to extend beyond bounds */
  padding: 12px 0;
  /* Increased padding to prevent clipping */
  flex: 1;
  max-width: 60%;
}

.title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-link {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  color: #F5F5DC !important;
  /* Force a warm off-white color */
  width: 100%;
}

.title-link:hover {
  transform: translateY(-1px);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  color: #FFFFFF !important;
  /* Pure white on hover */
}

/* Theme-specific title colors */
[data-theme="default"] .title-link {
  color: #F5DEB3 !important;
  /* Wheat color for D&D theme */
}

[data-theme="custom"] .title-link {
  color: #B8D8D8 !important;
  /* Light gray for Mystical Waters */
}

[data-theme="elegant"] .title-link {
  color: #EEF5DB !important;
  /* Cream for Elegant Sage */
}

[data-theme="light"] .title-link {
  color: #4F6367 !important;
  /* Dark gray for light theme */
}

.title-icon {
  font-size: 2.5rem !important;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  transition: color 0.3s ease;
  animation: diceRollAuto 6s ease-out infinite;
}

.title-link:hover .title-icon {
  animation: diceRollHover 2s ease-out;
}

@keyframes diceRollAuto {
  0% {
    transform: rotate(0deg);
  }

  33.33% {
    transform: rotate(720deg);
  }

  100% {
    transform: rotate(720deg);
  }
}

@keyframes diceRollHover {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(720deg);
  }
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.nav-btn {
  font-family: 'Quattrocento', serif !important;
  font-weight: 700;
  text-transform: none !important;
  letter-spacing: 0.3px;
  padding: 8px 14px !important;
  height: 44px !important;
  min-width: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-text {
  white-space: nowrap;
}

/* Theme-specific button text colors for proper contrast */
/* D&D Classic Dark theme - bronze/copper secondary needs dark text */
[data-theme="default"] .nav-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Mystical Waters theme - dark gray secondary needs light text */
[data-theme="custom"] .nav-btn {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* Elegant Sage theme - medium gray secondary needs dark text */
[data-theme="elegant"] .nav-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Sage Light theme - medium gray secondary needs dark text */
[data-theme="light"] .nav-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Fallback for any theme without specific rules */
.nav-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Icons should inherit the text color */
.nav-btn .v-icon {
  color: inherit !important;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-btn:hover::before {
  left: 100%;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.nav-btn .v-icon {
  font-size: 1.2rem !important;
  transition: transform 0.3s ease;
}

.nav-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Hamburger Menu Button */
.hamburger-btn {
  color: var(--theme-on-primary, #F5F5DC) !important;
  transition: all 0.3s ease;
}

.hamburger-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.05);
}

.hamburger-btn .v-icon {
  font-size: 1.5rem !important;
}

/* Navigation Drawer Styles */
.nav-drawer-list {
  padding-top: 16px;
}

.nav-drawer-item {
  margin: 4px 16px;
  border-radius: 8px;
  font-family: 'Quattrocento', serif !important;
  font-weight: 700;
  transition: all 0.3s ease;
  background-color: var(--theme-secondary) !important;
  color: var(--theme-on-secondary, #1A1A1A) !important;
  opacity: 0.92;
}

.nav-drawer-item:hover {
  background-color: var(--theme-secondary-lighten-1, #d4b839) !important;
  opacity: 1;
  transform: translateX(4px);
}

.nav-drawer-item--active {
  background-color: var(--theme-secondary-darken-2, #bfa22e) !important;
  opacity: 1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.nav-drawer-item .v-icon {
  color: inherit !important;
}

/* Theme-specific drawer item colors */
[data-theme="default"] .nav-drawer-item {
  color: rgba(0, 0, 0, 0.87) !important;
}

[data-theme="custom"] .nav-drawer-item {
  color: rgba(255, 255, 255, 0.95) !important;
}

[data-theme="elegant"] .nav-drawer-item {
  color: rgba(0, 0, 0, 0.87) !important;
}

[data-theme="light"] .nav-drawer-item {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Navigation responsive display */
.nav-buttons-desktop {
  display: flex !important;
}

.nav-buttons-mobile {
  display: none !important;
}

/* At 1117px and below, show hamburger menu */
@media (max-width: 1117px) {
  .nav-buttons-desktop {
    display: none !important;
  }

  .nav-buttons-mobile {
    display: inline-flex !important;
  }
}

/* Title responsive text display */
.title-full {
  display: inline !important;
}

.title-medium {
  display: none !important;
}

/* At 1116px and below, show medium title */
@media (max-width: 1116px) {
  .title-full {
    display: none !important;
  }

  .title-medium {
    display: inline !important;
  }
}

/* At 600px and below, hide all text, show only icon */
@media (max-width: 600px) {

  .title-full,
  .title-medium {
    display: none !important;
  }

  .title-icon {
    margin-right: 0 !important;
    font-size: 3rem !important;
  }

  .header-title {
    font-size: 1.3rem !important;
    max-width: 45%;
  }
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .nav-btn {
    min-width: 80px;
    padding: 8px 12px !important;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.5rem !important;
    max-width: 50%;
  }

  .title-icon {
    font-size: 2.5rem !important;
  }

  .nav-btn {
    min-width: 60px;
    padding: 6px 10px !important;
    height: 38px !important;
    margin-right: 6px;
  }

  .nav-btn:last-child {
    margin-right: 0;
  }
}

@media (max-width: 600px) {
  .header-title {
    font-size: 1.3rem !important;
    max-width: 45%;
  }

  .title-icon {
    font-size: 3rem !important;
  }

  .nav-btn {
    min-width: 44px;
    padding: 6px 8px !important;
    height: 36px !important;
    margin-right: 4px;
  }

  .nav-btn .v-icon {
    font-size: 1.1rem !important;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.1rem !important;
    max-width: 40%;
  }

  .title-icon {
    font-size: 2.5rem !important;
  }

  .nav-btn {
    min-width: 40px;
    height: 34px !important;
    padding: 5px 6px !important;
    margin-right: 3px;
  }

  .nav-btn .v-icon {
    font-size: 1rem !important;
  }
}

@media (max-width: 360px) {
  .header-title {
    font-size: 1rem !important;
    max-width: 35%;
  }

  .title-icon {
    font-size: 2rem !important;
  }

  .nav-btn {
    min-width: 36px;
    height: 32px !important;
    padding: 4px !important;
    margin-right: 2px;
  }

  .nav-btn .v-icon {
    font-size: 0.9rem !important;
  }
}
</style>
