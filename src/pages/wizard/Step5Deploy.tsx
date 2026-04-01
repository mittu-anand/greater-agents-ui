import { useState } from "react";
import { createAgent } from "../../api/client";
import { useWizardStore } from "../../store/useWizardStore";
import { Button } from "../../components/ui";
import { CheckCircle, Loader2, Save } from "lucide-react";

export default function Step5Save({ onSuccess }: { onSuccess: () => void }) {
  const { data } = useWizardStore();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Create as draft — no farm_id, no deploy
      await createAgent({ ...data, farm_id: null, model_id: data.llm_id });
      setDone(true);
      setTimeout(onSuccess, 800);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const rows: [string, string][] = [
    ["Name",        data.name],
    ["Framework",   data.framework.toUpperCase()],
    ["Toolkit",     data.toolkit || "—"],
    ["LLM",         data.llm_id || "—"],
    ["Temperature", String(data.temperature)],
    ["Tools",       `${data.tools.length} selected`],
    ["Trigger",     data.trigger_type || "—"],
    ["Config",      Object.keys(data.config).length > 0 ? "Custom JSON active" : "Default"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">Review & Save</h2>
        <p className="text-sm text-(--color-muted)">
          Agent will be saved to the Library as a draft. Assign it to a farm to deploy.
        </p>
      </div>

      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {rows.map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-(--color-muted)">{label}</p>
              <p className="text-sm font-medium text-(--color-text)">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle size={16} /> Saved to Agent Library
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!done && (
        <Button onClick={handleSave} disabled={saving} className="w-full justify-center py-3">
          {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save to Library</>}
        </Button>
      )}
    </div>
  );
}
