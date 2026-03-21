import { create } from "zustand";
import type { SimplifiedResponse } from "../api/endpoints";

export interface ChatEntry {
  chatId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  result?: SimplifiedResponse;
  timestamp: string;
}

interface ChatState {
  chats: ChatEntry[];
  messages: Record<string, ChatMessage[]>;
  setChats: (chats: ChatEntry[]) => void;
  addMessage: (chatId: string, msg: ChatMessage) => void;
  getMessages: (chatId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},

  setChats: (chats) => set({ chats }),

  addMessage: (chatId, msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] ?? []), msg],
      },
    })),

  getMessages: (chatId) => get().messages[chatId] ?? [],
}));
