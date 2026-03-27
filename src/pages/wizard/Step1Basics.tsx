import { useWizardStore } from "../../store/useWizardStore";
import { Input, Textarea } from "../../components/ui";

const PURPOSES = ["DevOps", "Data Pipeline", "Workflow", "Support", "Research", "Custom"];

export default function Step1Basics() {
  const { data, update } = useWizardStore();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">Basics</h2>
        <p className="text-sm text-(--color-muted)">Name your agent and pick a purpose.</p>
      </div>
      <Input label="Agent Name *" value={data.name} onChange={(e) => update({ name: e.target.value })}
        error={data.name.length > 0 && data.name.length < 3 ? "Min 3 characters" : undefined} placeholder="my-devops-agent" />
      <Textarea label="Description" rows={3} value={data.description} onChange={(e) => update({ description: e.target.value })} placeholder="What does this agent do?" />
      <div>
        <label className="text-xs font-medium text-(--color-text-sub) block mb-3">Purpose Tag</label>
        <div className="grid grid-cols-3 gap-3">
          {PURPOSES.map((p) => (
            <button key={p} onClick={() => update({ purpose_tag: p })}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left
                ${data.purpose_tag === p ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-text)"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
