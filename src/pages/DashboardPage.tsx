import { useQuery } from "@tanstack/react-query";
import { getFarms, getAgents } from "../api/client";
import { useEventStore } from "../store/useEventStore";
import { LoadingSkeleton, EmptyState, Button } from "../components/ui";
import { timeAgo } from "../lib/time";
import { useNavigate } from "react-router-dom";
import { Server, Bot, Activity, AlertCircle, Tractor } from "lucide-react";
import type { Farm } from "../types";

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex items-center gap-4">
      <div className="bg-(--color-border) p-2.5 rounded-xl"><Icon size={18} className="text-(--color-text)" /></div>
      <div>
        <p className="text-xs text-(--color-muted)">{label}</p>
        <p className="text-2xl font-bold leading-tight text-(--color-text)">{value}</p>
      </div>
    </div>
  );
}

function FarmRow({ farm }: { farm: Farm }) {
  const navigate = useNavigate();
  const { data: agents } = useQuery({ queryKey: ["agents", farm.id], queryFn: () => getAgents(farm.id) });
  const running = agents?.filter((a) => a.status === "running").length ?? 0;
  return (
    <button onClick={() => navigate(`/farms/${farm.id}`)}
      className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex items-center justify-between hover:border-(--color-text) transition-colors text-left">
      <div>
        <p className="font-medium text-sm text-(--color-text)">{farm.name}</p>
        <p className="text-xs text-(--color-muted) mt-0.5">{farm.target_type}</p>
      </div>
      <div className="text-xs text-(--color-muted)">{running}/{agents?.length ?? 0} running</div>
    </button>
  );
}

export default function DashboardPage() {
  const events = useEventStore((s) => s.events);
  const { data: farms, isLoading, error, refetch } = useQuery({ queryKey: ["farms"], queryFn: getFarms });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-8 w-full">
      {/* Inline error — page still renders */}
      {error && (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-(--color-surface) border border-red-300 rounded-xl text-sm">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span className="text-(--color-text-sub) flex-1">Could not reach API — showing local state.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-1 text-(--color-text)">Dashboard</h1>
      <p className="text-sm text-(--color-muted) mb-8">Overview of your agent farms.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Farms"  value={farms?.length ?? 0} icon={Server} />
        <StatCard label="Total Agents" value={0}                  icon={Bot} />
        <StatCard label="Running"      value={0}                  icon={Activity} />
        <StatCard label="Errors"       value={0}                  icon={AlertCircle} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-3">Recent Activity</h2>
          {events.length === 0 ? (
            <p className="text-sm text-(--color-muted)">No events yet.</p>
          ) : (
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl divide-y divide-(--color-border)">
              {events.slice(0, 20).map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-(--color-text)">{e.type}</p>
                    {(e.agent_name || e.server_name) && <p className="text-xs text-(--color-muted)">{e.agent_name ?? e.server_name}</p>}
                  </div>
                  <span className="text-xs text-(--color-muted)">{timeAgo(e.ts)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-3">Farms</h2>
          {!farms?.length ? (
            <EmptyState icon={Tractor} title="No farms" description="Create your first farm." />
          ) : (
            <div className="flex flex-col gap-2">
              {farms.map((farm) => <FarmRow key={farm.id} farm={farm} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
