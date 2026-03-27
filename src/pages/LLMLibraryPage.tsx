import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLLMs, createLLM, deleteLLM } from "../api/client";
import { LoadingSkeleton, EmptyState, Badge, Button, Input, Modal, ConfirmDialog } from "../components/ui";
import { useToastStore } from "../store/useToastStore";
import { Cpu, Plus, Trash2, Star } from "lucide-react";

const PROVIDERS = ["Anthropic", "Google", "Groq", "OpenAI", "Ollama", "NVIDIA NIM"];
const PROVIDER_COLORS: Record<string, string> = {
  OpenAI:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  Anthropic:   "bg-orange-50 text-orange-700 border-orange-200",
  Google:      "bg-blue-50 text-blue-700 border-blue-200",
  Groq:        "bg-purple-50 text-purple-700 border-purple-200",
  Ollama:      "bg-(--color-border) text-(--color-text-sub) border-(--color-border)",
  "NVIDIA NIM":"bg-green-50 text-green-700 border-green-200",
};

// Model name hints shown as placeholder per provider
const MODEL_HINTS: Record<string, string> = {
  OpenAI:       "gpt-4o",
  Anthropic:    "claude-3-5-sonnet-20241022",
  Google:       "gemini-1.5-flash",
  Groq:         "groq/llama-3.3-70b-versatile",
  Ollama:       "ollama/llama3",
  "NVIDIA NIM": "meta/llama-3.1-70b-instruct",
};

// Groq model suggestions
const GROQ_MODELS = [
  "groq/llama-3.3-70b-versatile",
  "groq/llama-3.1-8b-instant",
  "groq/mixtral-8x7b-32768",
  "groq/gemma2-9b-it",
];

export default function LLMLibraryPage() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ provider: "OpenAI", model_name: "", display_name: "", api_key: "", nim_base_url: "", is_default: false });

  const { data: llms, isLoading } = useQuery({ queryKey: ["llms"], queryFn: () => getLLMs() });

  const createMut = useMutation({
    mutationFn: createLLM,
    onSuccess: (llm) => {
      qc.invalidateQueries({ queryKey: ["llms"] });
      setOpen(false);
      setForm({ provider: "OpenAI", model_name: "", display_name: "", api_key: "", nim_base_url: "", is_default: false });
      toast(`LLM "${llm.display_name || llm.model_name}" added`);
    },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteLLM,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["llms"] });
      setDeleteId(null);
      toast("LLM deleted");
    },
    onError: (e) => {
      setDeleteId(null);
      toast((e as Error).message, "error");
    },
  });

  const deleteTarget = llms?.find((l) => l.id === deleteId);

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">LLM Library</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">{llms?.length ?? 0} global model configurations</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add LLM</Button>
      </div>

      {isLoading ? <LoadingSkeleton /> : !llms?.length ? (
        <EmptyState icon={Cpu} title="No LLMs configured" description="Add a global LLM to use across all agents."
          action={<Button onClick={() => setOpen(true)}><Plus size={15} /> Add LLM</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {llms.map((l) => {
            const cls = PROVIDER_COLORS[l.provider] ?? "bg-(--color-border) text-(--color-text-sub) border-(--color-border)";
            return (
              <div key={l.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex flex-col gap-3 hover:border-(--color-text) transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${cls}`}>{l.provider}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {l.is_default && <Star size={13} className="text-(--color-accent) fill-(--color-accent)" />}
                    <button onClick={() => setDeleteId(l.id)}
                      className="p-1 rounded text-(--color-muted) hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-(--color-text)">{l.display_name || l.model_name}</p>
                  <p className="text-xs font-mono text-(--color-muted) mt-0.5">{l.model_name}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap mt-auto">
                  {l.is_default && <Badge label="default" variant="running" />}
                  {l.is_global && <Badge label="global" variant="idle" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <Modal title="Add LLM" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {PROVIDERS.map((p) => (
                  <button key={p} onClick={() => setForm((f) => ({ ...f, provider: p }))}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${form.provider === p ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) text-(--color-text) hover:border-(--color-text)"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Model Name *" value={form.model_name} onChange={(e) => setForm((f) => ({ ...f, model_name: e.target.value }))} placeholder={MODEL_HINTS[form.provider] ?? "model-name"} />
            {form.provider === "Groq" && (
              <div>
                <p className="text-xs text-(--color-muted) mb-1.5">Quick select:</p>
                <div className="flex flex-wrap gap-1.5">
                  {GROQ_MODELS.map((m) => (
                    <button key={m} onClick={() => setForm((f) => ({ ...f, model_name: m }))}
                      className={`text-xs px-2 py-1 rounded-lg border transition-colors ${form.model_name === m ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) text-(--color-text) hover:border-(--color-text)"}`}>
                      {m.replace("groq/", "")}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Input label="Display Name" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} placeholder="GPT-4o" />
            <Input label="API Key" type="password" value={form.api_key} onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))} placeholder="Stored securely" />
            {form.provider === "NVIDIA NIM" && (
              <Input label="NIM Base URL" value={form.nim_base_url} onChange={(e) => setForm((f) => ({ ...f, nim_base_url: e.target.value }))} placeholder="http://nim.local:8000" />
            )}
            <label className="flex items-center gap-2 text-sm cursor-pointer text-(--color-text)">
              <input type="checkbox" checked={form.is_default} onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))} className="accent-(--color-accent)" />
              Set as default
            </label>
            {createMut.error && <p className="text-xs text-red-500">{(createMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => createMut.mutate(form)} disabled={!form.model_name || createMut.isPending}>
                {createMut.isPending ? "Adding…" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Delete "${deleteTarget?.display_name || deleteTarget?.model_name}"? Agents using this LLM will lose their model reference.`}
          onConfirm={() => deleteMut.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
