import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AgentStore {
  deployProgress: Record<string, { step: string; pct: number }>;
  setProgress: (id: string, step: string, pct: number) => void;
  clearProgress: (id: string) => void;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      deployProgress: {},
      setProgress: (id, step, pct) =>
        set((s) => ({ deployProgress: { ...s.deployProgress, [id]: { step, pct } } })),
      clearProgress: (id) =>
        set((s) => {
          const next = { ...s.deployProgress };
          delete next[id];
          return { deployProgress: next };
        }),
    }),
    { name: "agent-store" }
  )
);
