import { create } from "zustand";
import type { Toolkit, TriggerType, ToolType } from "../types";

export interface WizardTool {
  tool_id: string;
  tool_type: ToolType;
  config: Record<string, string>;
}

export interface WizardData {
  farm_id: string;
  name: string;
  description: string;
  purpose_tag: string;
  toolkit: Toolkit | "";
  framework: string;
  config: Record<string, any>;
  llm_id: string;
  temperature: number;
  system_prompt: string;
  nim_enabled: boolean;
  nim_base_url: string;
  tools: WizardTool[];
  trigger_type: TriggerType | "";
  trigger_config: Record<string, string>;
  environment_id: string;
  placement: "manual" | "least_loaded" | "label_match";
  placement_server_id: string;
  placement_labels: Record<string, string>;
}

interface WizardStore {
  step: number;
  data: WizardData;
  setStep: (n: number) => void;
  setFarmId: (id: string) => void;
  update: (patch: Partial<WizardData>) => void;
  reset: () => void;
}

const empty: WizardData = {
  farm_id: "", name: "", description: "", purpose_tag: "",
  toolkit: "", framework: "adk", config: {}, llm_id: "", temperature: 0.7,
  system_prompt: "", nim_enabled: false, nim_base_url: "",
  tools: [], trigger_type: "", trigger_config: {},
  environment_id: "", placement: "least_loaded",
  placement_server_id: "", placement_labels: {},
};

export const useWizardStore = create<WizardStore>((set) => ({
  step: 1,
  data: { ...empty },
  setStep: (n) => set({ step: n }),
  setFarmId: (id) => set((s) => ({ data: { ...s.data, farm_id: id } })),
  update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  reset: () => set({ step: 1, data: { ...empty } }),
}));
