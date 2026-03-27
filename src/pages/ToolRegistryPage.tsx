import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTools, registerTool, deleteTool } from "../api/client";
import { LoadingSkeleton, EmptyState, Badge, Button, Input, Textarea, Modal, ConfirmDialog } from "../components/ui";
import { useToastStore } from "../store/useToastStore";
import { Wrench, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { ToolType } from "../types";

const CATEGORIES = ["All", "communication", "data", "devops", "workflow", "trigger"];

export default function ToolRegistryPage() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", display_name: "", tool_type: "mcp" as ToolType,
    description: "", config_schema: "{}", categories: [] as string[], tagInput: "",
  });
  const [schemaError, setSchemaError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: tools, isLoading, error, refetch } = useQuery({ queryKey: ["tools"], queryFn: getTools });

  const createMut = useMutation({
    mutationFn: registerTool,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      setOpen(false);
      setForm({ name: "", display_name: "", tool_type: "mcp", description: "", config_schema: "{}", categories: [], tagInput: "" });
      toast("Tool registered");
    },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteTool,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      setDeleteId(null);
      toast("Tool deleted");
    },
    onError: (e) => {
      setDeleteId(null);
      toast((e as Error).message, "error");
    },
  });

  const validateSchema = (v: string) => {
    try { JSON.parse(v); setSchemaError(""); } catch { setSchemaError("Invalid JSON"); }
  };

  const addTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.categories.includes(t)) setForm((f) => ({ ...f, categories: [...f.categories, t], tagInput: "" }));
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.display_name.trim()) e.display_name = "Required";
    if (schemaError) e.config_schema = schemaError;
    setFormErrors(e);
    if (Object.keys(e).length) return;
    createMut.mutate({ ...form, config_schema: JSON.parse(form.config_schema) });
  };

  const filtered = (tools ?? []).filter((t) => {
    if (cat !== "All" && !t.categories.includes(cat)) return false;
    if (search && !t.display_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteTarget = tools?.find((t) => t.id === deleteId);

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">Tool Registry</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">{tools?.length ?? 0} tools registered</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Register Tool</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          className="bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
          placeholder="Search tools…" value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${cat === c ? "bg-(--color-accent) text-white" : "bg-(--color-border) text-(--color-text-sub) hover:text-(--color-text)"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSkeleton /> : error ? (
        <div className="text-sm text-red-500 p-4">Failed to load tools. <button onClick={() => refetch()} className="underline">Retry</button></div>
      ) : !filtered.length ? (
        <EmptyState icon={Wrench} title="No tools found" description="Register your first tool."
          action={<Button onClick={() => setOpen(true)}><Plus size={15} /> Register Tool</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex flex-col gap-2 hover:border-(--color-text) transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge label={t.tool_type} />
                  <span className="text-sm font-semibold text-(--color-text) truncate">{t.display_name}</span>
                </div>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="p-1 rounded text-(--color-muted) hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  title="Delete tool"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <p className="text-xs text-(--color-muted) line-clamp-2">{t.description}</p>

              <div className="flex gap-1 flex-wrap">
                {t.categories.map((c) => (
                  <span key={c} className="text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>

              <button
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                className="flex items-center gap-1 text-xs text-(--color-muted) hover:text-(--color-text) transition-colors mt-1 self-start"
              >
                {expanded === t.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                View Schema
              </button>

              {expanded === t.id && (
                <pre className="text-xs font-mono text-(--color-text) bg-(--color-bg) border border-(--color-border) rounded-lg p-3 whitespace-pre-wrap overflow-auto max-h-40">
                  {JSON.stringify(t.config_schema, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Register modal */}
      {open && (
        <Modal title="Register Tool" onClose={() => setOpen(false)} wide>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name * (slug)" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                error={formErrors.name} placeholder="my-tool" />
              <Input label="Display Name *" value={form.display_name}
                onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                error={formErrors.display_name} />
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Tool Type</label>
              <div className="flex gap-3">
                {(["mcp","openapi","function"] as ToolType[]).map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer text-(--color-text)">
                    <input type="radio" name="tool_type" value={t} checked={form.tool_type === t}
                      onChange={() => setForm((f) => ({ ...f, tool_type: t }))} className="accent-(--color-accent)" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <Textarea label="Description" rows={2} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <Textarea label="Config Schema (JSON)" rows={5} value={form.config_schema}
              onChange={(e) => setForm((f) => ({ ...f, config_schema: e.target.value }))}
              onBlur={(e) => validateSchema(e.target.value)}
              error={schemaError || formErrors.config_schema}
              className="font-mono text-xs" />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Categories</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {form.categories.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) }))}
                    className="text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                    {c} ×
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
                  placeholder="Add category…" value={form.tagInput}
                  onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button size="sm" variant="outline" onClick={addTag}>Add</Button>
              </div>
            </div>
            {createMut.error && <p className="text-xs text-red-500">{(createMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={createMut.isPending}>
                {createMut.isPending ? "Registering…" : "Register"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <ConfirmDialog
          message={`Delete tool "${deleteTarget?.display_name}"? This cannot be undone.`}
          onConfirm={() => deleteMut.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
