import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(notification) {
      this.notifications.push(notification);
    },
    removeNotification(index) {
      this.notifications.splice(index, 1);
    },
    clearAll() {
      this.notifications = [];
    },
  },
});
