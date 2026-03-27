import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllAgents, getFarms, assignAgent, stopAgent, deployAgent, deleteAgent } from "../api/client";
import { LoadingSkeleton, EmptyState, Badge, Button, Modal, Select, ConfirmDialog } from "../components/ui";
import { useToastStore } from "../store/useToastStore";
import { Bot, Plus, AlertCircle, Trash2 } from "lucide-react";
import { timeAgo } from "../lib/time";
import type { Agent, Farm } from "../types";

export default function AgentLibraryPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [assignTarget, setAssignTarget] = useState<Agent | null>(null);
  const [assignFarmId, setAssignFarmId] = useState("");
  const [assignError, setAssignError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: agents, isLoading } = useQuery({ queryKey: ["agents-all"], queryFn: () => getAllAgents() });
  const { data: farms } = useQuery({ queryKey: ["farms"], queryFn: getFarms });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["agents-all"] });

  const assignMut = useMutation({
    mutationFn: ({ id, farmId }: { id: string; farmId: string }) => assignAgent(id, { farm_id: farmId }),
    onSuccess: (agent) => {
      invalidate();
      setAssignTarget(null);
      setAssignFarmId("");
      toast(`Agent "${agent.name}" assigned to farm`);
    },
    onError: (e) => setAssignError((e as Error).message),
  });

  const stopMut = useMutation({
    mutationFn: stopAgent,
    onSuccess: () => { invalidate(); toast("Agent stopped"); },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const deployMut = useMutation({
    mutationFn: deployAgent,
    onSuccess: () => { invalidate(); toast("Agent deploying…", "info"); },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      invalidate();
      setDeleteId(null);
      toast("Agent deleted");
    },
    onError: (e) => {
      setDeleteId(null);
      toast((e as Error).message, "error");
    },
  });

  const filtered = (agents ?? []).filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const farmName = (id: string | null) => id ? (farms?.find((f) => f.id === id)?.name ?? id) : null;
  const deleteTarget = agents?.find((a) => a.id === deleteId);

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">Agent Library</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">{agents?.length ?? 0} agents — including drafts</p>
        </div>
        <Button onClick={() => navigate("/agents/new")}><Plus size={15} /> New Agent Config</Button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input className="bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
          placeholder="Search agents…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none"
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {["draft","stopped","running","error","pulling","pending","idle"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? <LoadingSkeleton /> : !filtered.length ? (
        <EmptyState icon={Bot} title="No agents" description="Create your first agent config."
          action={<Button onClick={() => navigate("/agents/new")}><Plus size={15} /> New Agent Config</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((agent) => {
            const farm = farmName(agent.farm_id);
            return (
              <div key={agent.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 hover:border-(--color-text) transition-colors flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <button className="text-left flex-1 min-w-0" onClick={() => navigate(`/agents/${agent.id}`)}>
                    <p className="font-semibold text-sm text-(--color-text) leading-tight truncate">{agent.name}</p>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge label={agent.status} />
                    <button onClick={() => setDeleteId(agent.id)}
                      className="p-1 rounded text-(--color-muted) hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <button className="text-left" onClick={() => navigate(`/agents/${agent.id}`)}>
                  <div className="flex gap-1.5 flex-wrap mb-1">
                    <Badge label={agent.toolkit} />
                    {agent.model_name && <Badge label={agent.model_name} variant="idle" />}
                  </div>
                  {farm
                    ? <span className="inline-flex items-center text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">{farm}</span>
                    : <span className="inline-flex items-center text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unassigned</span>
                  }
                  <p className="text-xs text-(--color-muted) mt-1">{agent.tool_count} tools · {timeAgo(agent.last_run)}</p>
                </button>
                <div className="flex gap-1 pt-1 border-t border-(--color-border)">
                  {agent.status === "draft" && (
                    <Button size="sm" variant="outline" className="flex-1 justify-center text-xs"
                      onClick={() => { setAssignTarget(agent); setAssignError(""); }}>Assign to Farm</Button>
                  )}
                  {agent.status === "stopped" && (
                    <Button size="sm" variant="outline" className="flex-1 justify-center text-xs"
                      onClick={() => deployMut.mutate(agent.id)}>Deploy</Button>
                  )}
                  {agent.status === "running" && (
                    <Button size="sm" variant="outline" className="flex-1 justify-center text-xs"
                      onClick={() => stopMut.mutate(agent.id)}>Stop</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {assignTarget && (
        <Modal title={`Assign "${assignTarget.name}" to Farm`} onClose={() => setAssignTarget(null)}>
          <div className="flex flex-col gap-4">
            <Select label="Farm" value={assignFarmId} onChange={(e) => setAssignFarmId(e.target.value)}>
              <option value="">Select a farm…</option>
              {(farms ?? []).map((f: Farm) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </Select>
            {assignError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{assignError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setAssignTarget(null)}>Cancel</Button>
              <Button onClick={() => assignMut.mutate({ id: assignTarget.id, farmId: assignFarmId })}
                disabled={!assignFarmId || assignMut.isPending}>
                {assignMut.isPending ? "Assigning…" : "Assign"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message={`Delete agent "${deleteTarget?.name}"? This cannot be undone.`}
          onConfirm={() => deleteMut.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
