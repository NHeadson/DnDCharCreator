import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/plugins/router.js";
import vuetify from "@/plugins/vuetify.js";
// Import the D&D API singleton
import { dndAPI } from "@/services/dndAPI.js";
import App from "./App.vue";
import "unfonts.css";

import "@/styles/theme.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth);
  }
});

export { app, auth, db };

const pinia = createPinia();
const vueApp = createApp(App);

vueApp.use(pinia); // Install Pinia before any store is used
vueApp.use(vuetify).use(router);

// Make dndAPI available globally
vueApp.config.globalProperties.$dndAPI = dndAPI;

vueApp.mount("#app");
export { dndAPI } from "@/services/dndAPI.js";
