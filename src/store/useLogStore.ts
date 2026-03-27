import { create } from "zustand";
import type { LogLine } from "../types";

interface LogStore {
  logs: Record<string, LogLine[]>;
  initLogs: (agentId: string, lines: LogLine[]) => void;
  appendLog: (agentId: string, line: LogLine) => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: {},
  initLogs: (agentId, lines) =>
    set((s) => ({ logs: { ...s.logs, [agentId]: lines.slice(-500) } })),
  appendLog: (agentId, line) =>
    set((s) => ({
      logs: {
        ...s.logs,
        [agentId]: [...(s.logs[agentId] ?? []), line].slice(-500),
      },
    })),
}));
