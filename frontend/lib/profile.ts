import { STORAGE_KEYS } from "./api";
import type {
  AccessibilityPreset,
  AdaptationIntensity,
  ConditionType,
  CognitivePriority,
  ExperienceDraft,
  ReadingLevel,
  UserProfile,
} from "./types";

export const DEFAULT_EXPERIENCE_DRAFT: ExperienceDraft = {
  condition: "manual",
  readingLevel: "A2",
  intensity: "balanced",
  maxSentenceLength: 10,
  tone: "calm_supportive",
  priorities: ["focus", "short_sentences"],
};

const EXPERIENCE_DRAFT_EVENT = "experience-draft-change";
let cachedDraftRaw: string | null = null;
let cachedDraftValue: ExperienceDraft = DEFAULT_EXPERIENCE_DRAFT;

function derivePreset(condition: ConditionType): AccessibilityPreset {
  if (condition === "combined") return "combined";
  if (condition === "dyslexia") return "dyslexia";
  if (condition === "adhd") return "adhd";
  return "custom";
}

export function createDraftFromCondition(
  condition: ConditionType,
): ExperienceDraft {
  const base = { ...DEFAULT_EXPERIENCE_DRAFT, condition };

  switch (condition) {
    case "adhd":
      return {
        ...base,
        readingLevel: "A2",
        intensity: "balanced",
        maxSentenceLength: 10,
        tone: "neutral_clear",
        priorities: ["focus", "step_by_step", "short_sentences"],
      };
    case "dyslexia":
      return {
        ...base,
        readingLevel: "A1",
        intensity: "balanced",
        maxSentenceLength: 8,
        tone: "calm_supportive",
        priorities: ["contrast", "short_sentences", "calm"],
      };
    case "combined":
      return {
        ...base,
        readingLevel: "A1",
        intensity: "strong",
        maxSentenceLength: 8,
        tone: "calm_supportive",
        priorities: ["focus", "contrast", "short_sentences", "step_by_step"],
      };
    case "unsure":
      return {
        ...base,
        readingLevel: "A2",
        intensity: "light",
        maxSentenceLength: 12,
        tone: "calm_supportive",
        priorities: ["focus", "calm"],
      };
    default:
      return base;
  }
}

export function applyIntensityToDraft(
  draft: ExperienceDraft,
  intensity: AdaptationIntensity,
): ExperienceDraft {
  const intensityMap: Record<
    AdaptationIntensity,
    { maxSentenceLength: number; readingLevel: ReadingLevel }
  > = {
    light: { maxSentenceLength: 14, readingLevel: "B1" },
    balanced: { maxSentenceLength: 10, readingLevel: "A2" },
    strong: { maxSentenceLength: 8, readingLevel: "A1" },
  };

  const target = intensityMap[intensity];

  return {
    ...draft,
    intensity,
    maxSentenceLength: target.maxSentenceLength,
    readingLevel: target.readingLevel,
  };
}

export function createProfileFromDraft(draft: ExperienceDraft): UserProfile {
  return {
    hasAdhd: draft.condition === "adhd" || draft.condition === "combined",
    hasDyslexia:
      draft.condition === "dyslexia" || draft.condition === "combined",
    readingLevel: draft.readingLevel,
    preset: derivePreset(draft.condition),
    maxSentenceLength: draft.maxSentenceLength,
    tone: draft.tone,
    priorities: draft.priorities,
  };
}

export function sanitizeDraft(value: unknown): ExperienceDraft {
  const candidate = value as Partial<ExperienceDraft> | null;

  if (!candidate) {
    return DEFAULT_EXPERIENCE_DRAFT;
  }

  return {
    condition: candidate.condition ?? DEFAULT_EXPERIENCE_DRAFT.condition,
    readingLevel: candidate.readingLevel ?? DEFAULT_EXPERIENCE_DRAFT.readingLevel,
    intensity: candidate.intensity ?? DEFAULT_EXPERIENCE_DRAFT.intensity,
    maxSentenceLength:
      candidate.maxSentenceLength ?? DEFAULT_EXPERIENCE_DRAFT.maxSentenceLength,
    tone: candidate.tone ?? DEFAULT_EXPERIENCE_DRAFT.tone,
    priorities: Array.isArray(candidate.priorities)
      ? (candidate.priorities as CognitivePriority[])
      : DEFAULT_EXPERIENCE_DRAFT.priorities,
  };
}

export function readExperienceDraft(): ExperienceDraft {
  if (typeof window === "undefined") {
    return DEFAULT_EXPERIENCE_DRAFT;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEYS.experienceDraft);

  if (!rawValue) {
    cachedDraftRaw = null;
    cachedDraftValue = DEFAULT_EXPERIENCE_DRAFT;
    return DEFAULT_EXPERIENCE_DRAFT;
  }

  if (rawValue === cachedDraftRaw) {
    return cachedDraftValue;
  }

  try {
    cachedDraftRaw = rawValue;
    cachedDraftValue = sanitizeDraft(JSON.parse(rawValue));
    return cachedDraftValue;
  } catch {
    cachedDraftRaw = null;
    cachedDraftValue = DEFAULT_EXPERIENCE_DRAFT;
    return DEFAULT_EXPERIENCE_DRAFT;
  }
}

export function writeExperienceDraft(draft: ExperienceDraft) {
  if (typeof window === "undefined") {
    return;
  }

  const serializedDraft = JSON.stringify(draft);
  cachedDraftRaw = serializedDraft;
  cachedDraftValue = draft;
  window.localStorage.setItem(STORAGE_KEYS.experienceDraft, serializedDraft);
  window.dispatchEvent(new Event(EXPERIENCE_DRAFT_EVENT));
}

export function subscribeExperienceDraft(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(EXPERIENCE_DRAFT_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EXPERIENCE_DRAFT_EVENT, handler);
  };
}
