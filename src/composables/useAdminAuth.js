import { computed, ref } from 'vue'

// Admin password - must be set in environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

// Reactive state
const isAuthenticated = ref(false)
const showAuthDialog = ref(false)
const passwordInput = ref('')
const authError = ref('')
const pendingAction = ref(null)
const authExpiresAt = ref(null)

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

export function useAdminAuth () {
  // Check if current session is still valid
  const isSessionValid = computed(() => {
    return (
      isAuthenticated.value
      && authExpiresAt.value
      && Date.now() < authExpiresAt.value
    )
  })

  // Authenticate admin user
  const authenticate = password => {
    // Check if environment variable is properly configured
    if (!ADMIN_PASSWORD) {
      authError.value
        = 'Admin authentication is not properly configured. Please contact the administrator.'
      console.error(
        'Missing required environment variable: VITE_ADMIN_PASSWORD',
      )
      return false
    }

    if (password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      authExpiresAt.value = Date.now() + SESSION_TIMEOUT
      authError.value = ''
      showAuthDialog.value = false
      passwordInput.value = ''

      // Execute pending action if any
      if (pendingAction.value) {
        pendingAction.value()
        pendingAction.value = null
      }

      return true
    } else {
      authError.value
        = 'Invalid password. Please contact the DM if you need access.'
      return false
    }
  }

  // Logout/clear authentication
  const logout = () => {
    isAuthenticated.value = false
    authExpiresAt.value = null
    showAuthDialog.value = false
    passwordInput.value = ''
    authError.value = ''
    pendingAction.value = null
  }

  // Check if user is admin (valid session)
  const checkAdminAccess = () => {
    if (isSessionValid.value) {
      return true
    }

    // Session expired, clear auth
    if (
      isAuthenticated.value
      && authExpiresAt.value
      && Date.now() >= authExpiresAt.value
    ) {
      logout()
    }

    return false
  }

  // Require admin authentication for an action
  const requireAuth = (action, actionName = 'perform this action') => {
    if (checkAdminAccess()) {
      // Already authenticated, execute immediately
      action()
    } else {
      // Need authentication, store action and show dialog
      pendingAction.value = action
      showAuthDialog.value = true
    }
  }

  // Handle auth dialog submission
  const handleAuthSubmit = () => {
    if (!passwordInput.value.trim()) {
      authError.value = 'Please enter a password'
      return
    }

    authenticate(passwordInput.value)
  }

  // Close auth dialog
  const closeAuthDialog = () => {
    showAuthDialog.value = false
    passwordInput.value = ''
    authError.value = ''
    pendingAction.value = null
  }

  // Extend session (call this on user activity)
  const extendSession = () => {
    if (isAuthenticated.value) {
      authExpiresAt.value = Date.now() + SESSION_TIMEOUT
    }
  }

  // Expose isAuthenticated as a writable ref for external sync
  // (This allows adminStore to set admin status)
  return {
    // State
    isAuthenticated,
    showAuthDialog,
    passwordInput,
    authError,

    // Methods
    authenticate,
    logout,
    checkAdminAccess,
    requireAuth,
    handleAuthSubmit,
    closeAuthDialog,
    extendSession,
  }
}
