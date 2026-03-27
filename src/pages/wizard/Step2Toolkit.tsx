import { useQuery } from "@tanstack/react-query";
import { getLLMs } from "../../api/client";
import { useWizardStore } from "../../store/useWizardStore";
import type { Toolkit } from "../../types";

const TOOLKITS: { name: Toolkit; desc: string }[] = [
  { name: "LangGraph",  desc: "Stateful multi-agent graphs" },
  { name: "CrewAI",     desc: "Role-based agent crews" },
  { name: "AutoGen",    desc: "Conversational agent framework" },
  { name: "Google ADK", desc: "Google Agent Development Kit" },
  { name: "Custom",     desc: "Bring your own framework" },
];

export default function Step2Toolkit({ farmId: _ }: { farmId: string }) {
  const { data, update } = useWizardStore();
  // Global LLMs — not per-farm
  const { data: llms } = useQuery({ queryKey: ["llms"], queryFn: () => getLLMs() });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">Toolkit & LLM</h2>
        <p className="text-sm text-(--color-muted)">Choose the agent framework and language model.</p>
      </div>

      <div>
        <label className="text-xs font-medium text-(--color-text-sub) block mb-3">Toolkit *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLKITS.map(({ name, desc }) => (
            <button key={name} onClick={() => update({ toolkit: name })}
              className={`px-4 py-3 rounded-xl border text-left transition-colors
                ${data.toolkit === name ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text)"}`}>
              <p className={`text-sm font-semibold ${data.toolkit === name ? "text-white" : "text-(--color-text)"}`}>{name}</p>
              <p className={`text-xs mt-0.5 ${data.toolkit === name ? "text-white/80" : "text-(--color-muted)"}`}>{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-(--color-text-sub) block mb-2">LLM *</label>
        {!llms?.length ? (
          <p className="text-sm text-(--color-muted)">No LLMs configured — <a href="/llms" className="text-(--color-accent) hover:underline">go to LLM Library</a>.</p>
        ) : (
          <select className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            value={data.llm_id} onChange={(e) => update({ llm_id: e.target.value })}>
            <option value="">Select a model…</option>
            {llms.map((l) => <option key={l.id} value={l.id}>{l.provider} — {l.model_name}</option>)}
          </select>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Temperature: {data.temperature}</label>
        <input type="range" min={0} max={1} step={0.1} value={data.temperature}
          onChange={(e) => update({ temperature: parseFloat(e.target.value) })}
          className="w-full accent-(--color-accent)" />
        <div className="flex justify-between text-xs text-(--color-muted) mt-1"><span>0.0</span><span>1.0</span></div>
      </div>
    </div>
  );
}
