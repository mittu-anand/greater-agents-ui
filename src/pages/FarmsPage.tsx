import { useState } from "react";
import { useToastStore } from "../store/useToastStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getFarms, createFarm, getAgents } from "../api/client";
import { LoadingSkeleton, EmptyState, Modal, Button, Input, Textarea } from "../components/ui";
import { Plus, Tractor, AlertCircle } from "lucide-react";
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
              <div className="flex flex-col gap-2">
                {TARGET_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer text-(--color-text)">
                    <input
                      type="radio"
                      name="target_type"
                      value={t}
                      checked={form.target_type === t}
                      onChange={() => setForm((f) => ({ ...f, target_type: t }))}
                      className="accent-(--color-accent)"
                    />
                    {t}
                  </label>
                ))}
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
  const running = agents?.filter((a) => a.status === "running").length ?? 0;
  const errors  = agents?.filter((a) => a.status === "error").length ?? 0;
  return (
    <button
      onClick={onClick}
      className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 text-left hover:border-(--color-text) transition-colors flex flex-col gap-3"
    >
      <div>
        <p className="font-semibold text-(--color-text)">{farm.name}</p>
        {farm.description && (
          <p className="text-xs text-(--color-muted) mt-0.5 line-clamp-2">{farm.description}</p>
        )}
      </div>
      <p className="text-xs text-(--color-muted)">{farm.target_type}</p>
      <div className="flex gap-3 text-xs text-(--color-muted)">
        <span>{agents?.length ?? 0} agents</span>
        <span>{running} running</span>
        {errors > 0 && <span className="text-red-500">{errors} errors</span>}
      </div>
    </button>
  );
}
