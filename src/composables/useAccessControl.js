import { ref, computed, onMounted } from "vue";

// Access control passwords - must be set in environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const ACCESS_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD;

// Session storage keys
const ACCESS_STATE_KEY = "dnd_access_state";
const ACCESS_EXPIRES_KEY = "dnd_access_expires";
const ACCESS_TYPE_KEY = "dnd_access_type";

// Reactive state for access control
const hasAccess = ref(false);
const accessExpiresAt = ref(null);
const showAccessDialog = ref(false);
const accessPasswordInput = ref("");
const accessError = ref("");
const pendingAccessAction = ref(null);
const accessType = ref(null); // 'admin' or 'user'

// Session timeout (2 hours for general access)
const ACCESS_SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

// Load access state from sessionStorage on initialization
const loadAccessState = () => {
  try {
    const savedAccess = sessionStorage.getItem(ACCESS_STATE_KEY);
    const savedExpires = sessionStorage.getItem(ACCESS_EXPIRES_KEY);
    const savedType = sessionStorage.getItem(ACCESS_TYPE_KEY);

    if (savedAccess === "true" && savedExpires) {
      const expiresTime = parseInt(savedExpires);
      if (Date.now() < expiresTime) {
        hasAccess.value = true;
        accessExpiresAt.value = expiresTime;
        accessType.value = savedType || null;
        return true;
      } else {
        // Session expired, clear storage
        clearAccessStorage();
      }
    }
  } catch (error) {
    console.warn("Failed to load access state from sessionStorage:", error);
    clearAccessStorage();
  }
  return false;
};

// Save access state to sessionStorage
const saveAccessState = () => {
  try {
    sessionStorage.setItem(ACCESS_STATE_KEY, hasAccess.value.toString());
    if (accessExpiresAt.value) {
      sessionStorage.setItem(
        ACCESS_EXPIRES_KEY,
        accessExpiresAt.value.toString()
      );
    }
    if (accessType.value) {
      sessionStorage.setItem(ACCESS_TYPE_KEY, accessType.value);
    } else {
      sessionStorage.removeItem(ACCESS_TYPE_KEY);
    }
  } catch (error) {
    console.warn("Failed to save access state to sessionStorage:", error);
  }
};

// Clear access state from sessionStorage
const clearAccessStorage = () => {
  try {
    sessionStorage.removeItem(ACCESS_STATE_KEY);
    sessionStorage.removeItem(ACCESS_EXPIRES_KEY);
    sessionStorage.removeItem(ACCESS_TYPE_KEY);
  } catch (error) {
    console.warn("Failed to clear access state from sessionStorage:", error);
  }
};

let singletonInstance;
export function useAccessControlSingleton() {
  if (!singletonInstance) {
    singletonInstance = useAccessControl();
  }
  return singletonInstance;
}

export function useAccessControl() {
  // Check if current access session is still valid
  const isAccessValid = computed(() => {
    return (
      hasAccess.value &&
      accessExpiresAt.value &&
      Date.now() < accessExpiresAt.value
    );
  });

  // Authenticate for general access
  const authenticateAccess = (password) => {
    // Check if environment variables are properly configured
    if (!ADMIN_PASSWORD || !ACCESS_PASSWORD) {
      accessError.value =
        "Access control is not properly configured. Please contact the administrator.";
      console.error(
        "Missing required environment variables: VITE_ADMIN_PASSWORD and/or VITE_ACCESS_PASSWORD"
      );
      return false;
    }

    if (password === ACCESS_PASSWORD || password === ADMIN_PASSWORD) {
      hasAccess.value = true;
      accessExpiresAt.value = Date.now() + ACCESS_SESSION_TIMEOUT;
      accessError.value = "";
      showAccessDialog.value = false;
      accessPasswordInput.value = "";
      accessType.value = password === ADMIN_PASSWORD ? "admin" : "user";

      // Save to sessionStorage
      saveAccessState();

      // Execute pending action if any
      if (pendingAccessAction.value) {
        pendingAccessAction.value();
        pendingAccessAction.value = null;
      }

      return true;
    } else {
      accessError.value =
        "Invalid access code. Please contact the DM for the correct code.";
      return false;
    }
  };

  // Clear access authentication
  const clearAccess = () => {
    hasAccess.value = false;
    accessExpiresAt.value = null;
    showAccessDialog.value = false;
    accessPasswordInput.value = "";
    accessError.value = "";
    pendingAccessAction.value = null;
    accessType.value = null;

    // Clear from sessionStorage
    clearAccessStorage();
  };

  // Check if user has valid access
  const checkAccess = () => {
    if (isAccessValid.value) {
      return true;
    }

    // Session expired, clear access
    if (
      hasAccess.value &&
      accessExpiresAt.value &&
      Date.now() >= accessExpiresAt.value
    ) {
      clearAccess();
    }

    return false;
  };

  // Extend access session (call this on user activity)
  const extendAccessSession = () => {
    if (hasAccess.value) {
      accessExpiresAt.value = Date.now() + ACCESS_SESSION_TIMEOUT;
      saveAccessState(); // Persist the extended session
    }
  };

  // Initialize access state from storage
  const initializeAccess = () => {
    loadAccessState();
  };

  // Require access authentication for an action
  const requireAccess = (action, actionName = "access this feature") => {
    if (checkAccess()) {
      // Already authenticated, execute immediately
      action();
    } else {
      // Need authentication, store action and show dialog
      pendingAccessAction.value = action;
      showAccessDialog.value = true;
    }
  };

  // Handle access dialog submission
  const handleAccessSubmit = (event) => {
    if (!accessPasswordInput.value.trim()) {
      accessError.value = "Please enter an access code";
      return false;
    }

    return authenticateAccess(accessPasswordInput.value);
  };

  // Close access dialog
  const closeAccessDialog = () => {
    showAccessDialog.value = false;
    accessPasswordInput.value = "";
    accessError.value = "";
    pendingAccessAction.value = null;
  };

  // Get remaining access time in minutes
  const getRemainingAccessTime = computed(() => {
    if (!hasAccess.value || !accessExpiresAt.value) return 0;
    const remaining = accessExpiresAt.value - Date.now();
    return Math.max(0, Math.floor(remaining / (60 * 1000)));
  });

  return {
    // State
    hasAccess: computed(() => isAccessValid.value),
    showAccessDialog,
    accessPasswordInput,
    accessError,
    getRemainingAccessTime,
    accessType: computed(() => accessType.value),
    isAdmin: computed(() => accessType.value === 'admin'),

    // Methods
    authenticateAccess,
    clearAccess,
    checkAccess,
    requireAccess,
    handleAccessSubmit,
    closeAccessDialog,
    extendAccessSession,
    initializeAccess,
  };
}
