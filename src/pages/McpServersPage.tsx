import { useState } from "react";
import { useToastStore } from "../store/useToastStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMcpServers, createMcpServer, deleteMcpServer, checkMcpHealth } from "../api/client";
import { LoadingSkeleton, EmptyState, Button, Input, Textarea, Modal, ConfirmDialog } from "../components/ui";
import { Server, Plus, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { timeAgo } from "../lib/time";
import type { McpHealthResult } from "../types";

const healthDot: Record<string, string> = { healthy: "bg-green-500", unhealthy: "bg-red-500", unknown: "bg-(--color-muted)" };

export default function McpServersPage() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [healthResults, setHealthResults] = useState<Record<string, McpHealthResult>>({});
  const [form, setForm] = useState({ name: "", display_name: "", url: "", auth_type: "none", auth_header_ref: "", description: "", categories: [] as string[], tagInput: "" });

  const { data: servers, isLoading } = useQuery({ queryKey: ["mcp-servers"], queryFn: () => getMcpServers() });

  const createMut = useMutation({
    mutationFn: createMcpServer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["mcp-servers"] }); setOpen(false); toast("MCP server registered"); },
  });
  const deleteMut = useMutation({ mutationFn: deleteMcpServer, onSuccess: () => { qc.invalidateQueries({ queryKey: ["mcp-servers"] }); setConfirmId(null); toast("MCP server deleted"); } });

  const runHealth = async (id: string) => {
    try {
      const r = await checkMcpHealth(id);
      setHealthResults((p) => ({ ...p, [id]: r }));
      qc.invalidateQueries({ queryKey: ["mcp-servers"] });
    } catch (e) {
      setHealthResults((p) => ({ ...p, [id]: { healthy: false, tool_count: 0, latency_ms: 0, tools: [], error: (e as Error).message } }));
    }
  };

  const addTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.categories.includes(t)) setForm((f) => ({ ...f, categories: [...f.categories, t], tagInput: "" }));
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">MCP Servers</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">Global MCP server registry</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Register MCP Server</Button>
      </div>

      {isLoading ? <LoadingSkeleton /> : !servers?.length ? (
        <EmptyState icon={Server} title="No MCP servers" description="Register an MCP server to use its tools in agents." action={<Button onClick={() => setOpen(true)}><Plus size={15} /> Register</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((s) => {
            const hr = healthResults[s.id];
            return (
              <div key={s.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${healthDot[s.health_status]}`} />
                    <p className="font-semibold text-sm text-(--color-text)">{s.display_name}</p>
                  </div>
                  <button onClick={() => setConfirmId(s.id)} className="text-(--color-muted) hover:text-red-600 transition-colors shrink-0"><Trash2 size={14} /></button>
                </div>
                <p className="text-xs font-mono text-(--color-muted) truncate">{s.url}</p>
                <div className="flex gap-1 flex-wrap">{s.categories.map((c) => <span key={c} className="text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">{c}</span>)}</div>
                {s.last_checked_at && <p className="text-xs text-(--color-muted)">Checked {timeAgo(s.last_checked_at)}</p>}
                <Button size="sm" variant="outline" onClick={() => runHealth(s.id)} className="w-full justify-center">
                  <RefreshCw size={12} /> Check Health
                </Button>
                {hr && (
                  <div className={`text-xs rounded-lg p-2 ${hr.healthy ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {hr.healthy ? (
                      <><CheckCircle size={12} className="inline mr-1" />{hr.tool_count} tools · {hr.latency_ms.toFixed(0)}ms</>
                    ) : (
                      <><XCircle size={12} className="inline mr-1" />{hr.error}</>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <Modal title="Register MCP Server" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name (slug) *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="my-mcp-server" />
              <Input label="Display Name *" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} />
            </div>
            <Input label="SSE Endpoint URL *" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="http://mcp.local:3000/sse" />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Auth Type</label>
              <div className="flex gap-3">
                {["none","header","oauth"].map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer text-(--color-text)">
                    <input type="radio" name="auth_type" value={t} checked={form.auth_type === t} onChange={() => setForm((f) => ({ ...f, auth_type: t }))} className="accent-(--color-accent)" />{t}
                  </label>
                ))}
              </div>
            </div>
            {form.auth_type === "header" && <Input label="Auth Header Ref (vault)" value={form.auth_header_ref} onChange={(e) => setForm((f) => ({ ...f, auth_header_ref: e.target.value }))} placeholder="secret/mcp/my-server" />}
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
              <Button onClick={() => createMut.mutate(form)} disabled={!form.name || !form.url || createMut.isPending}>{createMut.isPending ? "Registering…" : "Register"}</Button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Delete this MCP server?" onConfirm={() => { deleteMut.mutate(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}
