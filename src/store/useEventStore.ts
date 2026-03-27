import { create } from "zustand";
import type { AppEvent } from "../types";

interface EventStore {
  events: AppEvent[];
  push: (e: AppEvent) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  push: (e) => set((s) => ({ events: [e, ...s.events].slice(0, 200) })),
}));
