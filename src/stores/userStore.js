import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    showAuthDialog: false,
    passwordInput: "",
    authError: "",
    pendingAction: null,
    authExpiresAt: null,
    loading: false,
    error: null,
  }),
  actions: {
    authenticate(password) {
      const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      if (!ADMIN_PASSWORD) {
        this.authError = "Admin authentication is not properly configured.";
        return false;
      }
      if (password === ADMIN_PASSWORD) {
        this.isAuthenticated = true;
        this.authExpiresAt = Date.now() + SESSION_TIMEOUT;
        this.authError = "";
        this.showAuthDialog = false;
        this.passwordInput = "";
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
        return true;
      } else {
        this.authError = "Invalid password.";
        return false;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.authExpiresAt = null;
      this.showAuthDialog = false;
      this.passwordInput = "";
      this.authError = "";
      this.pendingAction = null;
    },
    checkAdminAccess() {
      if (this.isSessionValid) return true;
      if (
        this.isAuthenticated &&
        this.authExpiresAt &&
        Date.now() >= this.authExpiresAt
      ) {
        this.logout();
      }
      return false;
    },
    requireAuth(action) {
      if (this.checkAdminAccess()) {
        action();
      } else {
        this.pendingAction = action;
        this.showAuthDialog = true;
      }
    },
    handleAuthSubmit() {
      if (!this.passwordInput.trim()) {
        this.authError = "Please enter a password";
        return;
      }
      this.authenticate(this.passwordInput);
    },
    closeAuthDialog() {
      this.showAuthDialog = false;
      this.passwordInput = "";
      this.authError = "";
      this.pendingAction = null;
    },
    extendSession() {
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      if (this.isAuthenticated) {
        this.authExpiresAt = Date.now() + SESSION_TIMEOUT;
      }
    },
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    setLoading(val) {
      this.loading = val;
    },
    setError(err) {
      this.error = err;
    },
  },
  getters: {
    isSessionValid: (state) =>
      state.isAuthenticated &&
      state.authExpiresAt &&
      Date.now() < state.authExpiresAt,
    isAdmin: (state) => state.isSessionValid,
  },
});
