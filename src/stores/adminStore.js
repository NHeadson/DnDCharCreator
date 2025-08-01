import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export const useAdminStore = defineStore("admin", {
  state: () => ({
    isAdmin: false,
    hasAccess: false,
    accessType: null, // 'admin' or 'user'
    accessExpiresAt: null,
    showAccessDialog: false,
    accessPasswordInput: "",
    accessError: "",
    pendingAccessAction: null,
    loading: false,
    error: null,
  }),
  actions: {
    loadAccessState() {
      try {
        const savedAccess = sessionStorage.getItem("dnd_access_state");
        const savedExpires = sessionStorage.getItem("dnd_access_expires");
        const savedType = sessionStorage.getItem("dnd_access_type");
        if (savedAccess === "true" && savedExpires) {
          const expiresTime = Number.parseInt(savedExpires);
          if (Date.now() < expiresTime) {
            this.hasAccess = true;
            this.accessExpiresAt = expiresTime;
            this.accessType = savedType || null;
            return true;
          } else {
            this.clearAccessStorage();
          }
        }
      } catch (error) {
        this.clearAccessStorage();
      }
      return false;
    },
    saveAccessState() {
      try {
        sessionStorage.setItem("dnd_access_state", this.hasAccess.toString());
        if (this.accessExpiresAt) {
          sessionStorage.setItem(
            "dnd_access_expires",
            this.accessExpiresAt.toString()
          );
        }
        if (this.accessType) {
          sessionStorage.setItem("dnd_access_type", this.accessType);
        } else {
          sessionStorage.removeItem("dnd_access_type");
        }
      } catch (error) {}
    },
    clearAccessStorage() {
      try {
        sessionStorage.removeItem("dnd_access_state");
        sessionStorage.removeItem("dnd_access_expires");
        sessionStorage.removeItem("dnd_access_type");
      } catch (error) {}
    },
    async fetchAdminPassword() {
      try {
        const docRef = doc(db, "config", "adminPassword");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data().value;
        }
        return null;
      } catch (e) {
        return null;
      }
    },
    async fetchAccessPassword() {
      try {
        const docRef = doc(db, "config", "accessPassword");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data().value;
        }
        return null;
      } catch (e) {
        return null;
      }
    },
    async authenticateAccess(password) {
      const ACCESS_SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
      const adminPassword = await this.fetchAdminPassword();
      const accessPassword = await this.fetchAccessPassword();
      if (!adminPassword || !accessPassword) {
        this.accessError = "Access control is not properly configured.";
        return false;
      }
      if (password === accessPassword || password === adminPassword) {
        this.hasAccess = true;
        this.accessExpiresAt = Date.now() + ACCESS_SESSION_TIMEOUT;
        this.accessError = "";
        this.showAccessDialog = false;
        this.accessPasswordInput = "";
        this.accessType = password === adminPassword ? "admin" : "user";
        this.saveAccessState();
        return true;
      } else {
        this.accessError = "Invalid access code.";
        return false;
      }
    },
    clearAccess() {
      this.hasAccess = false;
      this.accessExpiresAt = null;
      this.showAccessDialog = false;
      this.accessPasswordInput = "";
      this.accessError = "";
      this.pendingAccessAction = null;
      this.accessType = null;
      this.clearAccessStorage();
    },
    checkAccess() {
      if (this.isAccessValid) return true;
      if (
        this.hasAccess &&
        this.accessExpiresAt &&
        Date.now() >= this.accessExpiresAt
      ) {
        this.clearAccess();
      }
      return false;
    },
    extendAccessSession() {
      const ACCESS_SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
      if (this.hasAccess) {
        this.accessExpiresAt = Date.now() + ACCESS_SESSION_TIMEOUT;
        this.saveAccessState();
      }
    },
    requireAccess(action) {
      if (this.checkAccess()) {
        action();
      } else {
        this.pendingAccessAction = action;
        this.showAccessDialog = true;
      }
    },
    handleAccessSubmit() {
      if (!this.accessPasswordInput.trim()) {
        this.accessError = "Please enter an access code";
        return false;
      }
      return this.authenticateAccess(this.accessPasswordInput);
    },
    closeAccessDialog() {
      this.showAccessDialog = false;
      this.accessPasswordInput = "";
      this.accessError = "";
      this.pendingAccessAction = null;
    },
    initializeAccess() {
      this.loadAccessState();
    },
    reset() {
      this.clearAccess();
    },
  },
  getters: {
    isAccessValid: (state) =>
      state.hasAccess &&
      state.accessExpiresAt &&
      Date.now() < state.accessExpiresAt,
    getRemainingAccessTime: (state) => {
      if (!state.hasAccess || !state.accessExpiresAt) return 0;
      const remaining = state.accessExpiresAt - Date.now();
      return Math.max(0, Math.floor(remaining / (60 * 1000)));
    },
    isAdminUser: (state) => state.accessType === "admin",
    accessTypeValue: (state) => state.accessType,
  },
});
