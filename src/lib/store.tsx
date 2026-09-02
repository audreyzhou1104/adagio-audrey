import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export type Profile = {
  name: string;
  age: string;
  level: string;
  styles: string;
  focusId: string;
  focusLabel: string;
  startedOn: string;
  goal: string;
  createdAt: string;
};

export type CheckLog = Record<string, string[]>; // taskId -> ISO dates completed

export type JournalEntry = {
  id: string;
  date: string;
  prompt: string;
  text: string;
  summary: string;
  themes: string[];
  suggestions: string[];
};

export type ReadinessSnapshot = {
  id: string;
  date: string;
  physical: number;
  psychological: number;
  overall: number;
};

export type IdentityMap = {
  values: string[];
  answers: Record<string, string>;
};

export type Appearance = {
  theme: "light" | "dark";
  accent: AccentKey;
  density: "comfortable" | "compact";
  radius: number;
  fontScale: number;
  motion: boolean;
};

export type AccentKey = "slate" | "sage" | "champagne" | "plum" | "ocean";

export const accents: Record<AccentKey, { label: string; primary: string; accent: string; ring: string; swatch: string }> = {
  slate: { label: "Muted navy", primary: "213 32% 26%", accent: "140 14% 60%", ring: "213 32% 40%", swatch: "#2c3e52" },
  sage: { label: "Soft sage", primary: "150 18% 32%", accent: "150 20% 62%", ring: "150 20% 42%", swatch: "#42655a" },
  champagne: { label: "Warm champagne", primary: "32 34% 38%", accent: "38 42% 74%", ring: "32 34% 50%", swatch: "#7d5f3f" },
  plum: { label: "Quiet plum", primary: "285 18% 32%", accent: "300 16% 66%", ring: "285 18% 46%", swatch: "#553f5c" },
  ocean: { label: "Deep ocean", primary: "196 38% 28%", accent: "188 26% 60%", ring: "196 38% 42%", swatch: "#2a5563" },
};

export type CheckIn = { pain: number; mood: number; confidence: number; sleep: number };

export type IdentitySnapshot = {
  id: string;
  date: string; // ISO timestamp
  center: string;
  values: string[];
  answers: Record<string, string>;
  branches: { label: string; text: string }[];
};

/** -1 = gentler version, 0 = standard, 1 = progressed version of a plan step. */
export type TaskLevel = -1 | 0 | 1;

export type AdagioState = {
  profile: Profile | null;
  premium: boolean;
  tasks: CheckLog;
  taskLevels: Record<string, TaskLevel>;
  checkins: Record<string, CheckIn>;
  journal: JournalEntry[];
  readiness: ReadinessSnapshot[];
  identity: IdentityMap;
  identityHistory: IdentitySnapshot[];
  appearance: Appearance;
};

const defaultState: AdagioState = {
  profile: null,
  premium: false,
  tasks: {},
  taskLevels: {},
  checkins: {},
  journal: [],
  readiness: [],
  identity: { values: [], answers: {} },
  identityHistory: [],
  appearance: { theme: "light", accent: "slate", density: "comfortable", radius: 0.75, fontScale: 1, motion: true },
};


const keyFor = (userId?: string | null) => `adagio.state.v1.${userId ?? "guest"}`;

function load(key: string): AdagioState {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      taskLevels: { ...(parsed.taskLevels ?? {}) },
      identity: { ...defaultState.identity, ...(parsed.identity ?? {}) },
      appearance: { ...defaultState.appearance, ...(parsed.appearance ?? {}) },
    };
  } catch {
    return defaultState;
  }
}

type Ctx = {
  state: AdagioState;
  update: (patch: Partial<AdagioState>) => void;
  setAppearance: (patch: Partial<Appearance>) => void;
  toggleTask: (taskId: string) => void;
  setTaskLevel: (taskId: string, level: TaskLevel) => void;
  resetTaskLevels: () => void;
  reset: () => void;
};


const AdagioContext = createContext<Ctx | null>(null);

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const AdagioProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const storageKey = keyFor(user?.id);
  const [state, setState] = useState<AdagioState>(() =>
    typeof window === "undefined" ? defaultState : load(keyFor(user?.id)),
  );
  const loadedKey = useRef(storageKey);

  // Each account gets its own saved data.
  useEffect(() => {
    if (loadedKey.current === storageKey) return;
    loadedKey.current = storageKey;
    setState(load(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (loadedKey.current !== storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    const { theme, accent, radius, fontScale, motion, density } = state.appearance;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    const a = accents[accent] ?? accents.slate;
    root.style.setProperty("--primary", a.primary);
    root.style.setProperty("--accent", a.accent);
    root.style.setProperty("--ring", a.ring);
    root.style.setProperty("--radius", `${radius}rem`);
    root.style.fontSize = `${16 * fontScale}px`;
    root.dataset.density = density;
    root.dataset.motion = motion ? "on" : "off";
  }, [state.appearance]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      update: (patch) => setState((s) => ({ ...s, ...patch })),
      setAppearance: (patch) => setState((s) => ({ ...s, appearance: { ...s.appearance, ...patch } })),
      toggleTask: (taskId) =>
        setState((s) => {
          const day = todayKey();
          const done = s.tasks[taskId] ?? [];
          const next = done.includes(day) ? done.filter((d) => d !== day) : [...done, day];
          return { ...s, tasks: { ...s.tasks, [taskId]: next } };
        }),
      setTaskLevel: (taskId, level) =>
        setState((s) => ({ ...s, taskLevels: { ...(s.taskLevels ?? {}), [taskId]: level } })),
      resetTaskLevels: () => setState((s) => ({ ...s, taskLevels: {} })),
      reset: () => setState(defaultState),
    }),

    [state],
  );

  return <AdagioContext.Provider value={value}>{children}</AdagioContext.Provider>;
};

export const useAdagio = () => {
  const ctx = useContext(AdagioContext);
  if (!ctx) throw new Error("useAdagio must be used inside AdagioProvider");
  return ctx;
};
