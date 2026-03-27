import { useState } from "react";
import { useToastStore } from "../store/useToastStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOpenApiSpecs, createOpenApiSpec, syncOpenApiSpec, deleteOpenApiSpec } from "../api/client";
import { LoadingSkeleton, EmptyState, Button, Input, Textarea, Modal, ConfirmDialog } from "../components/ui";
import { FileCode, Plus, Trash2, RefreshCw } from "lucide-react";
import { timeAgo } from "../lib/time";

export default function OpenApiSpecsPage() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", display_name: "", spec_url: "", auth_type: "none", auth_header_ref: "", description: "", categories: [] as string[], tagInput: "" });

  const { data: specs, isLoading } = useQuery({ queryKey: ["openapi-specs"], queryFn: () => getOpenApiSpecs() });

  const createMut = useMutation({
    mutationFn: createOpenApiSpec,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["openapi-specs"] }); setOpen(false); toast("Spec added and synced"); },
  });
  const deleteMut = useMutation({ mutationFn: deleteOpenApiSpec, onSuccess: () => { qc.invalidateQueries({ queryKey: ["openapi-specs"] }); setConfirmId(null); toast("Spec deleted"); } });

  const handleSync = async (id: string) => {
    setSyncing(id);
    try { await syncOpenApiSpec(id); qc.invalidateQueries({ queryKey: ["openapi-specs"] }); }
    finally { setSyncing(null); }
  };

  const endpointCount = (spec: { spec_content: Record<string, unknown> | null }): number => {
    if (!spec.spec_content) return 0;
    const paths = (spec.spec_content as { paths?: Record<string, unknown> }).paths ?? {};
    return Object.values(paths).reduce((n: number, methods) => n + Object.keys(methods as object).filter((m) => ["get","post","put","patch","delete"].includes(m)).length, 0);
  };

  const addTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.categories.includes(t)) setForm((f) => ({ ...f, categories: [...f.categories, t], tagInput: "" }));
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">OpenAPI Specs</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">Registered API specs as tool sources</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Spec</Button>
      </div>

      {isLoading ? <LoadingSkeleton /> : !specs?.length ? (
        <EmptyState icon={FileCode} title="No specs registered" description="Add an OpenAPI spec to expose its endpoints as agent tools." action={<Button onClick={() => setOpen(true)}><Plus size={15} /> Add Spec</Button>} />
      ) : (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-(--color-border)">
              <tr className="text-xs text-(--color-muted)">{["Name","Spec URL","Endpoints","Last Synced","Actions"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {specs.map((s) => (
                <tr key={s.id} className="hover:bg-(--color-bg) transition-colors">
                  <td className="px-4 py-3 font-medium text-(--color-text)">{s.display_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-(--color-muted) max-w-xs truncate">{s.spec_url}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{endpointCount(s)}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{s.last_synced_at ? timeAgo(s.last_synced_at) : "Never"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleSync(s.id)} disabled={syncing === s.id}><RefreshCw size={12} className={syncing === s.id ? "animate-spin" : ""} /> Sync</Button>
                      <button onClick={() => setConfirmId(s.id)} className="text-(--color-muted) hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal title="Add OpenAPI Spec" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name (slug) *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="my-api" />
              <Input label="Display Name *" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} />
            </div>
            <Input label="Spec URL *" value={form.spec_url} onChange={(e) => setForm((f) => ({ ...f, spec_url: e.target.value }))} placeholder="https://api.example.com/openapi.json" />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Auth Type</label>
              <div className="flex gap-3">
                {["none","header"].map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer text-(--color-text)">
                    <input type="radio" name="spec_auth" value={t} checked={form.auth_type === t} onChange={() => setForm((f) => ({ ...f, auth_type: t }))} className="accent-(--color-accent)" />{t}
                  </label>
                ))}
              </div>
            </div>
            {form.auth_type === "header" && <Input label="Auth Header Ref" value={form.auth_header_ref} onChange={(e) => setForm((f) => ({ ...f, auth_header_ref: e.target.value }))} />}
            <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Categories</label>
              <div className="flex gap-1 flex-wrap mb-2">{form.categories.map((c) => <button key={c} onClick={() => setForm((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) }))} className="text-xs bg-(--color-border) px-2 py-0.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">{c} ×</button>)}</div>
              <div className="flex gap-2">
                <input className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)" placeholder="Add category…" value={form.tagInput} onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                <Button size="sm" variant="outline" onClick={addTag}>Add</Button>
              </div>
            </div>
            {createMut.error && <p className="text-xs text-red-500">{(createMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => createMut.mutate(form)} disabled={!form.name || !form.spec_url || createMut.isPending}>{createMut.isPending ? "Fetching & saving…" : "Add Spec"}</Button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Delete this spec?" onConfirm={() => { deleteMut.mutate(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}
