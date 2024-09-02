import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
  }),
  actions: {
    setUserId(id: string) {
      this.userId = id;
    },
  },
});
