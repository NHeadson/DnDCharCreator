import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    language: "en",
    showTips: true,
    otherSettings: {},
  }),
  actions: {
    setLanguage(lang) {
      this.language = lang;
    },
    setShowTips(val) {
      this.showTips = val;
    },
    setSetting(key, value) {
      this.otherSettings[key] = value;
    },
  },
});
