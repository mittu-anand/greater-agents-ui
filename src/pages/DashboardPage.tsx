import { useQuery } from "@tanstack/react-query";
import { getFarms, getAgents, getAllAgents, getLLMs, getMcpServers } from "../api/client";
import { LoadingSkeleton, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Server, Bot, Activity, AlertCircle, Tractor,
  Cpu, Network, ChevronRight, Circle, Container,
  Cloud, Plus,
} from "lucide-react";
import type { Farm } from "../types";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, accent = false, danger = false, onClick,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; accent?: boolean; danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-(--color-surface) border rounded-2xl p-5 text-left transition-all flex flex-col gap-3
        ${onClick ? "hover:border-(--color-accent) hover:shadow-sm cursor-pointer" : "cursor-default"}
        ${danger ? "border-red-200" : "border-(--color-border)"}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center
        ${danger ? "bg-red-50" : accent ? "bg-(--color-accent)/10" : "bg-(--color-border)"}`}>
        <Icon size={16} className={danger ? "text-red-500" : accent ? "text-(--color-accent)" : "text-(--color-text-sub)"} />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${danger && (value as number) > 0 ? "text-red-500" : "text-(--color-text)"}`}>
          {value}
        </p>
        <p className="text-xs text-(--color-muted) mt-1">{label}</p>
        {sub && <p className="text-xs text-(--color-muted) mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

// ── Farm row ──────────────────────────────────────────────────────────────────
function FarmRow({ farm }: { farm: Farm }) {
  const navigate = useNavigate();
  const { data: agents } = useQuery({ queryKey: ["agents", farm.id], queryFn: () => getAgents(farm.id), refetchInterval: 30_000 });
  const total   = agents?.length ?? 0;
  const running = agents?.filter((a) => a.status === "running").length ?? 0;
  const errors  = agents?.filter((a) => a.status === "error").length ?? 0;
  const pct     = total > 0 ? Math.round((running / total) * 100) : 0;

  const TypeIcon = farm.target_type === "kubernetes" ? Container
                 : farm.target_type === "cloud"       ? Cloud
                 : Server;

  return (
    <button onClick={() => navigate(`/farms/${farm.id}`)}
      className="group bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 flex items-center gap-4 hover:border-(--color-accent) transition-all text-left">
      <div className="w-9 h-9 bg-(--color-border) rounded-xl flex items-center justify-center shrink-0">
        <TypeIcon size={15} className="text-(--color-text-sub)" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-(--color-text) truncate">{farm.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 bg-(--color-border) rounded-full overflow-hidden max-w-28">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: errors > 0 ? "#ef4444" : "var(--color-accent)" }} />
          </div>
          <span className="text-xs text-(--color-muted) shrink-0">{running}/{total}</span>
        </div>
      </div>
      {errors > 0 && (
        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">{errors} err</span>
      )}
      <ChevronRight size={14} className="text-(--color-muted) opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

// ── Running agent row ─────────────────────────────────────────────────────────
function AgentRow({ agent }: { agent: import("../types").Agent }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/agents/${agent.id}`)}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-(--color-bg) transition-colors text-left w-full">
      <Circle size={7} className="text-(--color-accent) fill-(--color-accent) shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-(--color-text) truncate">{agent.name}</p>
        <p className="text-xs text-(--color-muted) truncate">{agent.model_name || agent.toolkit}</p>
      </div>
      <span className="text-xs text-(--color-muted) shrink-0 font-mono">{agent.server_host?.split(":").pop() ?? ""}</span>
      <ChevronRight size={13} className="text-(--color-muted) opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: farms,     isLoading } = useQuery({ queryKey: ["farms"],      queryFn: getFarms, refetchInterval: 30_000 });
  const { data: allAgents }            = useQuery({ queryKey: ["agents-all"], queryFn: () => getAllAgents(), refetchInterval: 30_000 });
  const { data: llms }                 = useQuery({ queryKey: ["llms"],       queryFn: () => getLLMs() });
  const { data: mcpServers }           = useQuery({ queryKey: ["mcp-servers"],queryFn: () => getMcpServers() });

  const totalAgents = allAgents?.length ?? 0;
  const running     = allAgents?.filter((a) => a.status === "running") ?? [];
  const errors      = allAgents?.filter((a) => a.status === "error").length ?? 0;
  const drafts      = allAgents?.filter((a) => a.status === "draft").length ?? 0;
  const mcpHealthy  = mcpServers?.filter((m) => m.health_status === "healthy").length ?? 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-8 w-full">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-(--color-text)">
          {greeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-(--color-muted) mt-0.5">
          {running.length > 0
            ? `${running.length} agent${running.length !== 1 ? "s" : ""} running across ${farms?.length ?? 0} farm${(farms?.length ?? 0) !== 1 ? "s" : ""}`
            : "No agents running — deploy one to get started"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Farms"         value={farms?.length ?? 0}  icon={Tractor}      onClick={() => navigate("/farms")} />
        <StatCard label="Total Agents"  value={totalAgents}          icon={Bot}          onClick={() => navigate("/agents")} />
        <StatCard label="Running"       value={running.length}       icon={Activity}     accent onClick={() => navigate("/agents?status=running")} />
        <StatCard label="Errors"        value={errors}               icon={AlertCircle}  danger onClick={() => navigate("/agents?status=error")} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left col — farms */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
              <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider">Farms</p>
              <button onClick={() => navigate("/farms")} className="text-xs text-(--color-accent) hover:underline">View all</button>
            </div>
            {!farms?.length ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-(--color-muted) mb-3">No farms yet</p>
                <Button size="sm" onClick={() => navigate("/farms")}><Plus size={13} /> New Farm</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {farms.map((farm) => <FarmRow key={farm.id} farm={farm} />)}
              </div>
            )}
          </div>

          {/* Infrastructure summary */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider">Infrastructure</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-(--color-text)">
                <Cpu size={14} className="text-(--color-muted)" />
                <span>LLM Providers</span>
              </div>
              <span className="text-sm font-semibold text-(--color-text)">{llms?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-(--color-text)">
                <Network size={14} className="text-(--color-muted)" />
                <span>MCP Servers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-(--color-text)">{mcpServers?.length ?? 0}</span>
                {(mcpServers?.length ?? 0) > 0 && (
                  <span className="text-xs text-(--color-muted)">({mcpHealthy} healthy)</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-(--color-text)">
                <Bot size={14} className="text-(--color-muted)" />
                <span>Draft agents</span>
              </div>
              <span className="text-sm font-semibold text-(--color-text)">{drafts}</span>
            </div>
          </div>
        </div>

        {/* Right col — running agents */}
        <div className="lg:col-span-2">
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider">Live Agents</p>
                {running.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-(--color-accent) bg-(--color-accent)/10 px-2 py-0.5 rounded-full">
                    <Circle size={5} className="fill-(--color-accent)" />
                    {running.length} online
                  </span>
                )}
              </div>
              <button onClick={() => navigate("/agents")} className="text-xs text-(--color-accent) hover:underline">View all</button>
            </div>

            {running.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 bg-(--color-border) rounded-2xl flex items-center justify-center">
                  <Bot size={20} className="text-(--color-muted)" />
                </div>
                <p className="text-sm text-(--color-muted)">No agents running</p>
                <Button size="sm" variant="outline" onClick={() => navigate("/agents/new")}>
                  <Plus size={13} /> Create Agent
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-(--color-border)">
                {running.map((agent) => <AgentRow key={agent.id} agent={agent} />)}
              </div>
            )}

            {/* Error agents */}
            {errors > 0 && (
              <>
                <div className="px-4 py-2 border-t border-(--color-border) bg-red-50">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Errors</p>
                </div>
                <div className="divide-y divide-(--color-border)">
                  {allAgents?.filter((a) => a.status === "error").map((agent) => (
                    <button key={agent.id} onClick={() => navigate(`/agents/${agent.id}`)}
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left w-full">
                      <Circle size={7} className="text-red-500 fill-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-(--color-text) truncate">{agent.name}</p>
                        <p className="text-xs text-red-400">error</p>
                      </div>
                      <ChevronRight size={13} className="text-(--color-muted) opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
