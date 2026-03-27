import { useState } from "react";
import { useToastStore } from "../store/useToastStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkills, createSkill, deleteSkill, getAllAgents, applySkill } from "../api/client";
import { LoadingSkeleton, EmptyState, Button, Input, Textarea, Modal, ConfirmDialog } from "../components/ui";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import type { Agent } from "../types";

export default function AgentSkillsPage() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [applyTarget, setApplyTarget] = useState<string | null>(null);
  const [applyAgentId, setApplyAgentId] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [tab, setTab] = useState<"definition"|"tools">("definition");
  const [form, setForm] = useState({ name: "", display_name: "", description: "", system_prompt_fragment: "", categories: [] as string[], tagInput: "" });

  const { data: skills, isLoading } = useQuery({ queryKey: ["skills"], queryFn: () => getSkills() });
  const { data: agents } = useQuery({ queryKey: ["agents-all"], queryFn: () => getAllAgents() });

  const createMut = useMutation({
    mutationFn: createSkill,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["skills"] }); setOpen(false); toast("Skill created"); },
  });
  const deleteMut = useMutation({ mutationFn: deleteSkill, onSuccess: () => { qc.invalidateQueries({ queryKey: ["skills"] }); setConfirmId(null); toast("Skill deleted"); } });
  const applyMut  = useMutation({
    mutationFn: ({ skillId, agentId }: { skillId: string; agentId: string }) => applySkill(agentId, skillId),
    onSuccess: () => { setApplyTarget(null); setApplyAgentId(""); toast("Skill applied to agent"); },
  });

  const addTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.categories.includes(t)) setForm((f) => ({ ...f, categories: [...f.categories, t], tagInput: "" }));
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">Agent Skills</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">Reusable skill bundles — prompt fragments + tools</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Create Skill</Button>
      </div>

      {isLoading ? <LoadingSkeleton /> : !skills?.length ? (
        <EmptyState icon={Sparkles} title="No skills yet" description="Create a reusable skill to apply to multiple agents." action={<Button onClick={() => setOpen(true)}><Plus size={15} /> Create Skill</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <div key={s.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-(--color-text)">{s.display_name}</p>
                <button onClick={() => setConfirmId(s.id)} className="text-(--color-muted) hover:text-red-600 transition-colors shrink-0"><Trash2 size={14} /></button>
              </div>
              {s.description && <p className="text-xs text-(--color-muted) line-clamp-2">{s.description}</p>}
              <div className="flex gap-1 flex-wrap">{s.categories.map((c) => <span key={c} className="text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">{c}</span>)}</div>
              <p className="text-xs text-(--color-muted)">{s.tools.length} tool source{s.tools.length !== 1 ? "s" : ""}</p>
              <Button size="sm" variant="outline" className="w-full justify-center" onClick={() => { setApplyTarget(s.id); setApplyAgentId(""); }}>
                <Sparkles size={12} /> Apply to Agent
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create Skill Modal */}
      {open && (
        <Modal title="Create Skill" onClose={() => setOpen(false)} wide>
          <div className="flex gap-2 mb-4">
            {(["definition","tools"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${tab === t ? "bg-(--color-accent) text-white" : "bg-(--color-border) text-(--color-text-sub)"}`}>
                {t === "definition" ? "Definition" : "Tools"}
              </button>
            ))}
          </div>
          {tab === "definition" ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Name (slug) *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="my-skill" />
                <Input label="Display Name *" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} />
              </div>
              <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              <Textarea label="System Prompt Fragment *" rows={6} value={form.system_prompt_fragment}
                onChange={(e) => setForm((f) => ({ ...f, system_prompt_fragment: e.target.value }))}
                placeholder="This text is appended to the agent's system prompt when the skill is applied…"
                className="font-mono text-xs" />
              <div>
                <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Categories</label>
                <div className="flex gap-1 flex-wrap mb-2">{form.categories.map((c) => <button key={c} onClick={() => setForm((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) }))} className="text-xs bg-(--color-border) px-2 py-0.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">{c} ×</button>)}</div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)" placeholder="Add category…" value={form.tagInput} onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                  <Button size="sm" variant="outline" onClick={addTag}>Add</Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-(--color-muted) py-4 text-center">Tool sources can be added after creating the skill.</p>
          )}
          {createMut.error && <p className="text-xs text-red-500 mt-3">{(createMut.error as Error).message}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ ...form, tools: [], default_config: {} })} disabled={!form.name || !form.system_prompt_fragment || createMut.isPending}>
              {createMut.isPending ? "Creating…" : "Create Skill"}
            </Button>
          </div>
        </Modal>
      )}

      {/* Apply to Agent Modal */}
      {applyTarget && (
        <Modal title="Apply Skill to Agent" onClose={() => setApplyTarget(null)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Agent</label>
              <select className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
                value={applyAgentId} onChange={(e) => setApplyAgentId(e.target.value)}>
                <option value="">Select an agent…</option>
                {(agents ?? []).map((a: Agent) => <option key={a.id} value={a.id}>{a.name} {!a.farm_id ? "(draft)" : ""}</option>)}
              </select>
            </div>
            {applyMut.error && <p className="text-xs text-red-500">{(applyMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setApplyTarget(null)}>Cancel</Button>
              <Button onClick={() => applyMut.mutate({ skillId: applyTarget, agentId: applyAgentId })} disabled={!applyAgentId || applyMut.isPending}>
                {applyMut.isPending ? "Applying…" : "Apply"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && <ConfirmDialog message="Delete this skill?" onConfirm={() => { deleteMut.mutate(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}
