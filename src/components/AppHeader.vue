<template>
  <v-app-bar app class="theme-primary-bg header-enhanced" elevation="4" height="80">
    <v-toolbar-title class="header-title">
      <router-link class="text-decoration-none theme-text title-link" to="/">
        <v-icon class="me-2 title-icon" icon="mdi-dice-d20" />
        D&D Character Tool
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <div class="nav-buttons">
      <v-btn class="theme-secondary-bg nav-btn" rounded="lg" to="/" variant="flat">
        <v-icon class="me-2" icon="mdi-home" />
        Home
      </v-btn>

      <v-btn class="theme-secondary-bg nav-btn me-3" rounded="lg" to="/characters" variant="flat">
        <v-icon class="me-2" icon="mdi-account-group" />
        My Characters
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAccessControlSingleton } from '@/composables/useAccessControl'

  const router = useRouter()
  const accessControl = useAccessControlSingleton()
  const hasAccess = computed(() => accessControl.hasAccess)
  const requireAccess = accessControl.requireAccess

  const requireAccessForCreation = () => {
    requireAccess(() => {
      router.push('/character-form')
    }, 'create a new character')
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Quattrocento:wght@400;700&display=swap');

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
}

.title-link {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  color: #F5F5DC !important;
  /* Force a warm off-white color */
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
  font-size: 2rem !important;
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
  gap: 8px;
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .header-title {
    font-size: 1.4rem !important;
  }

  .nav-btn {
    min-width: 100px;
    padding: 10px 16px !important;
    height: 40px !important;
  }

  .nav-btn span {
    font-size: 0.875rem;
  }

  .title-icon {
    font-size: 1.6rem !important;
  }
}

@media (max-width: 600px) {
  .nav-btn span:not(.v-icon) {
    display: none;
  }

  .nav-btn {
    min-width: 48px;
    padding: 10px !important;
  }

  .header-title {
    font-size: 1.2rem !important;
  }
}
</style>
