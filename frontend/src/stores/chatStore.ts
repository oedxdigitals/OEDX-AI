/**
 * Chat Store using Zustand
 */

import { create } from "zustand";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatState = {
  messages: Message[];
  input: string;
  chatId: number;
  loading: boolean;
  abortController: AbortController | null;

  setInput: (value: string) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  resetChat: () => void;

  setLoading: (value: boolean) => void;
  setAbortController: (c: AbortController | null) => void;

  newChat: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  input: "",
  chatId: Date.now(),
  loading: false,
  abortController: null,

  setInput: (value) => set({ input: value }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setMessages: (msgs) => set({ messages: msgs }),

  setLoading: (value) => set({ loading: value }),

  setAbortController: (c) => set({ abortController: c }),

  resetChat: () =>
    set({
      messages: [],
      input: "",
      loading: false,
    }),

  newChat: () => {
    const { abortController } = get();

    if (abortController) abortController.abort();

    set({
      messages: [],
      input: "",
      chatId: Date.now(),
      loading: false,
      abortController: null,
    });
  },
}));
