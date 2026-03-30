import { useState } from "react";
import { useToastStore } from "../store/useToastStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getFarms, createFarm, getAgents } from "../api/client";
import { LoadingSkeleton, EmptyState, Modal, Button, Input, Textarea } from "../components/ui";
import { Plus, Tractor, AlertCircle, Server, Container, Cloud, Hammer, Download, ChevronRight } from "lucide-react";
import type { TargetType, Farm } from "../types";

const TARGET_TYPES: TargetType[] = ["dedicated_servers", "kubernetes", "cloud"];

export default function FarmsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", target_type: "dedicated_servers" as TargetType });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: farms, isLoading, error, refetch } = useQuery({
    queryKey: ["farms"],
    queryFn: getFarms,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["farms"] });
      setOpen(false);
      setForm({ name: "", description: "", target_type: "dedicated_servers" });
      toast("Farm created");
    },
  });

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    setFormErrors(e);
    if (Object.keys(e).length) return;
    mutation.mutate(form);
  };

  const farmList = farms ?? [];

  return (
    <div className="p-8 w-full">
      {/* Header — always visible */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">Farms</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">
            {isLoading ? "Loading…" : `${farmList.length} farm${farmList.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={15} /> New Farm
        </Button>
      </div>

      {/* Inline error banner — doesn't replace the page */}
      {error && (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-(--color-surface) border border-red-300 rounded-xl text-sm">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span className="text-(--color-text-sub) flex-1">Could not reach API — showing local state.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : farmList.length === 0 ? (
        <EmptyState
          icon={Tractor}
          title="No farms yet"
          description="Create your first agent farm to start deploying agents."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus size={15} /> New Farm
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmList.map((farm) => (
            <FarmCard key={farm.id} farm={farm} onClick={() => navigate(`/farms/${farm.id}`)} />
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <Modal title="New Farm" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={formErrors.name}
              autoFocus
              placeholder="my-gpu-farm"
            />
            <Textarea
              label="Description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What is this farm for?"
            />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Target Type</label>
              <div className="grid grid-cols-3 gap-2">
                {TARGET_TYPES.map((t) => {
                  const Icon = t === "kubernetes" ? Container : t === "cloud" ? Cloud : Server;
                  const labels: Record<string, string> = { dedicated_servers: "Servers", kubernetes: "Kubernetes", cloud: "Cloud" };
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, target_type: t }))}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        form.target_type === t
                          ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent)"
                          : "border-(--color-border) text-(--color-text) hover:border-(--color-text)"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs">{labels[t]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {mutation.error && (
              <p className="text-xs text-red-500">{(mutation.error as Error).message}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={mutation.isPending}>
                {mutation.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FarmCard({ farm, onClick }: { farm: Farm; onClick: () => void }) {
  const { data: agents } = useQuery({
    queryKey: ["agents", farm.id],
    queryFn: () => getAgents(farm.id),
    retry: 1,
  });
  const total   = agents?.length ?? 0;
  const running = agents?.filter((a) => a.status === "running").length ?? 0;
  const errors  = agents?.filter((a) => a.status === "error").length ?? 0;
  const stopped = agents?.filter((a) => a.status === "stopped").length ?? 0;
  const healthPct = total > 0 ? Math.round((running / total) * 100) : 0;

  const TypeIcon = farm.target_type === "kubernetes" ? Container
                 : farm.target_type === "cloud"       ? Cloud
                 : Server;

  const typeLabel = farm.target_type === "kubernetes" ? "Kubernetes"
                  : farm.target_type === "cloud"       ? "Cloud"
                  : "Dedicated Servers";

  const DeployIcon = farm.deploy_strategy === "pull" ? Download : Hammer;
  const deployLabel = farm.deploy_strategy === "pull"
    ? "Pull image"   // pulls a pre-built Docker image from a registry
    : "Build on server"; // clones repo and builds Docker image on the server

  return (
    <button
      onClick={onClick}
      className="group bg-(--color-surface) border border-(--color-border) rounded-2xl p-5 text-left hover:border-(--color-accent) hover:shadow-sm transition-all flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-(--color-text) truncate">{farm.name}</p>
          {farm.description && (
            <p className="text-xs text-(--color-muted) mt-0.5 line-clamp-1">{farm.description}</p>
          )}
        </div>
        {/* Target type badge */}
        <span className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text-sub)">
          <TypeIcon size={11} />
          {typeLabel}
        </span>
      </div>

      {/* Agent stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-(--color-bg) rounded-xl py-2.5">
          <span className="text-lg font-bold text-(--color-text) leading-none">{total}</span>
          <span className="text-[10px] text-(--color-muted) mt-0.5">agents</span>
        </div>
        <div className="flex flex-col items-center bg-(--color-bg) rounded-xl py-2.5">
          <span className={`text-lg font-bold leading-none ${running > 0 ? "text-(--color-accent)" : "text-(--color-muted)"}`}>{running}</span>
          <span className="text-[10px] text-(--color-muted) mt-0.5">running</span>
        </div>
        <div className="flex flex-col items-center bg-(--color-bg) rounded-xl py-2.5">
          <span className={`text-lg font-bold leading-none ${errors > 0 ? "text-red-500" : "text-(--color-muted)"}`}>{errors}</span>
          <span className="text-[10px] text-(--color-muted) mt-0.5">errors</span>
        </div>
      </div>

      {/* Health bar */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-(--color-muted) mb-1.5">
            <span>Health</span>
            <span>{healthPct}%</span>
          </div>
          <div className="h-1.5 bg-(--color-border) rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${healthPct}%`,
                backgroundColor: errors > 0 ? "#ef4444" : "var(--color-accent)",
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-(--color-border)">
        <span className="flex items-center gap-1.5 text-xs text-(--color-muted)" title={deployLabel}>
          <DeployIcon size={11} />
          {farm.deploy_strategy === "pull" ? "Pull image" : "Build on server"}
        </span>
        <ChevronRight size={14} className="text-(--color-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
