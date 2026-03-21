import { create } from "zustand";

interface AccessibilityState {
  dyslexicFont: boolean;
  fontSize: "normal" | "large" | "xlarge";
  beelineActive: boolean;
  toggleDyslexicFont: () => void;
  setFontSize: (size: "normal" | "large" | "xlarge") => void;
  toggleBeeline: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set, get) => ({
  dyslexicFont: false,
  fontSize: "normal",
  beelineActive: false,

  toggleDyslexicFont: () => {
    const next = !get().dyslexicFont;
    document.body.classList.toggle("font-dyslexic", next);
    set({ dyslexicFont: next });
  },

  setFontSize: (size) => {
    document.body.classList.remove("text-large", "text-xlarge");
    if (size !== "normal") document.body.classList.add(`text-${size}`);
    set({ fontSize: size });
  },

  toggleBeeline: () => set((s) => ({ beelineActive: !s.beelineActive })),
}));
