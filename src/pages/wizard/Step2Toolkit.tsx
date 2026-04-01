import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLLMs } from "../../api/client";
import { useWizardStore } from "../../store/useWizardStore";
import type { Toolkit } from "../../types";

const TOOLKITS: { name: Toolkit; framework: string; desc: string }[] = [
  { name: "Google ADK", framework: "adk",       desc: "Google Agent Development Kit (Native)" },
  { name: "LangGraph",  framework: "langgraph", desc: "Stateful multi-agent graphs" },
  { name: "CrewAI",     framework: "crewai",    desc: "Role-based agent crews" },
  { name: "LangChain",  framework: "langchain", desc: "Standard chains and agents" },
  { name: "AutoGen",    framework: "autogen",   desc: "Conversational agent framework" },
  { name: "Custom",     framework: "custom",    desc: "Bring your own framework" },
];

export default function Step2Toolkit({ farmId: _ }: { farmId: string }) {
  const { data, update } = useWizardStore();
  const { data: llms } = useQuery({ queryKey: ["llms"], queryFn: () => getLLMs() });
  const [configStr, setConfigStr] = useState(JSON.stringify(data.config, null, 2));
  const [jsonError, setJsonError] = useState("");

  const handleFrameworkChange = (name: Toolkit, framework: string) => {
    update({ toolkit: name, framework });
  };

  const handleConfigChange = (val: string) => {
    setConfigStr(val);
    try {
      const parsed = JSON.parse(val);
      update({ config: parsed });
      setJsonError("");
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  // Sync configStr if data.config changes externally
  useEffect(() => {
    const current = JSON.stringify(data.config, null, 2);
    if (current !== configStr && !jsonError) {
      setConfigStr(current);
    }
  }, [data.config]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">Framework & LLM</h2>
        <p className="text-sm text-(--color-muted)">Choose the orchestration framework and language model.</p>
      </div>

      <div>
        <label className="text-xs font-medium text-(--color-text-sub) block mb-3">Framework *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLKITS.map(({ name, framework, desc }) => (
            <button key={name} onClick={() => handleFrameworkChange(name, framework)}
              className={`px-4 py-3 rounded-xl border text-left transition-colors
                ${data.toolkit === name ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text)"}`}>
              <p className={`text-sm font-semibold ${data.toolkit === name ? "text-white" : "text-(--color-text)"}`}>{name}</p>
              <p className={`text-xs mt-0.5 ${data.toolkit === name ? "text-white/80" : "text-(--color-muted)"}`}>{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {data.framework !== "adk" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-xs font-medium text-(--color-text-sub) block mb-2">
            Framework Configuration (JSON)
          </label>
          <textarea
            value={configStr}
            onChange={(e) => handleConfigChange(e.target.value)}
            className={`w-full bg-(--color-bg) border ${jsonError ? "border-red-500" : "border-(--color-border)"} rounded-lg px-3 py-2 text-xs font-mono text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent) h-32 resize-none`}
            placeholder='{ "key": "value" }'
          />
          {jsonError && <p className="text-[10px] text-red-500 mt-1">Invalid JSON: {jsonError}</p>}
          <p className="text-[10px] text-(--color-muted) mt-1">
            Override framework-specific settings (e.g. roles, state, Graph IDs).
          </p>
        </div>
      )}

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
