import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
    state: () => ({
        conversationId: '',
      }),
      actions: {
        setConversationId(id: string) {
          this.conversationId = id;
        },
      },
})