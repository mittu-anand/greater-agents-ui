import { useWizardStore } from "../../store/useWizardStore";
import { Textarea } from "../../components/ui";

const TEMPLATES: Record<string, string> = {
  "DevOps Agent":       "You are a DevOps agent. You manage infrastructure, deployments, and CI/CD pipelines. You have access to shell tools and container management APIs.",
  "Data Pipeline":      "You are a data pipeline agent. You orchestrate ETL workflows, monitor data quality, and trigger downstream processes when data arrives.",
  "Workflow Builder":   "You are a workflow automation agent. You coordinate tasks across multiple systems, handle approvals, and ensure processes complete successfully.",
  "Support Agent":      "You are a customer support agent. You answer questions, escalate issues, and create tickets when needed. Be concise and helpful.",
};

export default function Step3Prompt() {
  const { data, update } = useWizardStore();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">System Prompt</h2>
        <p className="text-sm text-(--color-muted)">Define the agent's behaviour and capabilities.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.keys(TEMPLATES).map((t) => (
          <button key={t} onClick={() => update({ system_prompt: TEMPLATES[t] })}
            className="px-3 py-1.5 text-xs rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-text-sub) hover:border-(--color-text) hover:text-(--color-text) transition-colors">
            {t}
          </button>
        ))}
      </div>

      <Textarea label="System Prompt *" rows={10} value={data.system_prompt}
        onChange={(e) => update({ system_prompt: e.target.value })}
        error={data.system_prompt.length > 0 && data.system_prompt.length < 20 ? "Min 20 characters" : undefined}
        placeholder="You are an agent that…"
        className="font-mono text-xs" />

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer text-(--color-text)">
          <input type="checkbox" checked={data.nim_enabled} onChange={(e) => update({ nim_enabled: e.target.checked })} className="accent-(--color-accent)" />
          Route through local NIM endpoint
        </label>
        {data.nim_enabled && (
          <input className="mt-3 w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            placeholder="http://nim.local:8000" value={data.nim_base_url}
            onChange={(e) => update({ nim_base_url: e.target.value })} />
        )}
      </div>
    </div>
  );
}
