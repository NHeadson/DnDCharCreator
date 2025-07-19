import { createApp } from "vue";
import router from "@/plugins/router.js";
import vuetify from "@/plugins/vuetify.js";
import App from "./App.vue";
import "unfonts.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu-z_oN1psAA-HkuUXIN4WX5SjK8DTpC4",
  authDomain: "dndcharcreator-93e5a.firebaseapp.com",
  projectId: "dndcharcreator-93e5a",
  storageBucket: "dndcharcreator-93e5a.firebasestorage.app",
  messagingSenderId: "60182926274",
  appId: "1:60182926274:web:d54ce2b1688b13d1a87c5b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

createApp(App).use(vuetify).use(router).mount("#app");
