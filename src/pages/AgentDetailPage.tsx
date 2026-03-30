import { useState, useEffect, useRef } from "react";
import { useToastStore } from "../store/useToastStore";
import { useParams, useNavigate, Link, Routes, Route, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgent, stopAgent, restartAgent, deleteAgent, getAgentRuns, getAgentLogs, getAgentDockerLogs, updateAgent } from "../api/client";
import { LoadingSkeleton, ErrorCard, NavTabs, Badge, Button, ConfirmDialog, StyledSelect } from "../components/ui";
import { useLogStore } from "../store/useLogStore";
import { timeAgo, formatUptime } from "../lib/time";
import { StopCircle, RefreshCw, Trash2, AlertCircle, Send, Loader2, Server, Cpu, Clock, Wrench, Pencil, Save, X, RotateCcw } from "lucide-react";

const MASK_KEYS = /key|token|secret|password/i;

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [confirmAction, setConfirmAction] = useState<"stop" | "restart" | "delete" | null>(null);

  const { data: agent, isLoading, error, refetch } = useQuery({
    queryKey: ["agent", agentId], queryFn: () => getAgent(agentId!), enabled: !!agentId,
    refetchInterval: 30_000,
  });

  const stopMut    = useMutation({ mutationFn: () => stopAgent(agentId!),    onSuccess: () => { qc.invalidateQueries({ queryKey: ["agent", agentId] }); toast("Agent stopped"); } });
  const restartMut = useMutation({ mutationFn: () => restartAgent(agentId!), onSuccess: () => { qc.invalidateQueries({ queryKey: ["agent", agentId] }); toast("Agent restarting…", "info"); } });
  const deleteMut  = useMutation({ mutationFn: () => deleteAgent(agentId!),  onSuccess: () => { toast("Agent deleted"); navigate(agent?.farm_id ? `/farms/${agent.farm_id}` : "/agents"); } });

  if (isLoading) return <LoadingSkeleton />;
  if (!agent) return (
    <div className="p-8">
      <div className="flex items-center gap-3 px-4 py-3 bg-(--color-surface) border border-red-300 rounded-xl text-sm max-w-lg">
        <AlertCircle size={16} className="text-red-500 shrink-0" />
        <span className="text-(--color-text-sub) flex-1">{(error as Error)?.message ?? "Agent not found"}</span>
        <button onClick={() => refetch()} className="text-xs text-(--color-accent) hover:underline">Retry</button>
      </div>
    </div>
  );

  const isRunning = agent.status === "running";
  const base = `/agents/${agentId}`;
  const tabs = [
    { label: "Overview", to: `${base}/overview` },
    { label: "Chat",     to: `${base}/chat` },
    { label: "Logs",     to: `${base}/logs` },
    { label: "Runs",     to: `${base}/runs` },
    { label: "Config",   to: `${base}/config` },
  ];

  return (
    <div className="p-8 w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">{agent.name}</h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge label={agent.status} />
            <Badge label={agent.toolkit} />
            {agent.model_name && <Badge label={agent.model_name} variant="idle" />}
            <span className="text-xs text-(--color-muted)">up {formatUptime(agent.uptime_seconds)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"
            onClick={() => setConfirmAction("stop")}
            disabled={!isRunning || stopMut.isPending}>
            <StopCircle size={13} /> Stop
          </Button>
          <Button variant="outline" size="sm"
            onClick={() => setConfirmAction("restart")}
            disabled={restartMut.isPending}>
            <RefreshCw size={13} /> Restart
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmAction("delete")}>
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>

      <NavTabs tabs={tabs} />
      <div className="mt-6">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewTab agent={agent} />} />
          <Route path="chat"     element={<ChatTab agent={agent} />} />
          <Route path="logs"     element={<LogsTab agentId={agentId!} />} />
          <Route path="runs"     element={<RunsTab agentId={agentId!} />} />
          <Route path="config"   element={<ConfigTab agent={agent} />} />
        </Routes>
      </div>

      {confirmAction === "stop" && (
        <ConfirmDialog
          message={`Stop "${agent.name}"?`}
          detail="The agent container will be stopped on the server. You can restart it at any time."
          confirmLabel="Stop Agent"
          onConfirm={() => { setConfirmAction(null); stopMut.mutate(); }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === "restart" && (
        <ConfirmDialog
          message={`Restart "${agent.name}"?`}
          detail="The agent will be stopped and redeployed. There will be a brief downtime."
          confirmLabel="Restart"
          variant="primary"
          onConfirm={() => { setConfirmAction(null); restartMut.mutate(); }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === "delete" && (
        <ConfirmDialog
          message={`Delete "${agent.name}"?`}
          detail="This will permanently remove the agent and all its run history. This cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => { setConfirmAction(null); deleteMut.mutate(); }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

function OverviewTab({ agent }: { agent: import("../types").Agent }) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Stats row */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-(--color-border) rounded-xl flex items-center justify-center shrink-0">
          <Server size={16} className="text-(--color-text-sub)" />
        </div>
        <div>
          <p className="text-xs text-(--color-muted)">Server</p>
          <p className="text-sm font-medium text-(--color-text) truncate max-w-40">{agent.server_host || "—"}</p>
        </div>
      </div>
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-(--color-border) rounded-xl flex items-center justify-center shrink-0">
          <Cpu size={16} className="text-(--color-text-sub)" />
        </div>
        <div>
          <p className="text-xs text-(--color-muted)">Model</p>
          <p className="text-sm font-medium text-(--color-text)">{agent.model_name || "—"}</p>
        </div>
      </div>
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-(--color-border) rounded-xl flex items-center justify-center shrink-0">
          <Clock size={16} className="text-(--color-text-sub)" />
        </div>
        <div>
          <p className="text-xs text-(--color-muted)">Deployed</p>
          <p className="text-sm font-medium text-(--color-text)">{timeAgo(agent.deployed_at)}</p>
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-2 bg-(--color-surface) border border-(--color-border) rounded-xl p-6 flex flex-col gap-3">
        <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-1">Details</p>
        <Row label="Farm">
          {agent.farm_id
            ? <Link to={`/farms/${agent.farm_id}`} className="text-(--color-accent) hover:underline text-sm">{agent.farm_id}</Link>
            : <span className="text-sm text-(--color-muted)">Unassigned</span>}
        </Row>
        <Row label="Container">{agent.container_id ? agent.container_id.slice(0, 12) + "…" : "—"}</Row>
        <Row label="Trigger">{agent.trigger_type}</Row>
        <Row label="Tools">
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {agent.tools.length === 0
              ? <span className="text-sm text-(--color-muted)">No tools</span>
              : agent.tools.map((t) => (
                <span key={t.id} className="flex items-center gap-1 text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">
                  <Wrench size={10} /> {t.display_name || t.name}
                </span>
              ))}
          </div>
        </Row>
      </div>

      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6">
        <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-3">Trigger Config</p>
        <pre className="text-xs text-(--color-text) font-mono whitespace-pre-wrap break-all leading-relaxed">{JSON.stringify(agent.trigger_config, null, 2)}</pre>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs text-(--color-muted) w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-(--color-text)">{children}</span>
    </div>
  );
}

const LEVEL_CLS: Record<string, string> = {
  debug: "text-(--color-muted)", info: "text-(--color-text)", warn: "text-(--color-accent)", error: "text-red-500",
};
const EMPTY_LOGS: import("../types").LogLine[] = [];

function LogsTab({ agentId }: { agentId: string }) {
  const { initLogs } = useLogStore();
  const logs = useLogStore((s) => s.logs[agentId] ?? EMPTY_LOGS);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [source, setSource] = useState<"db" | "docker">("docker");
  const [dockerLogs, setDockerLogs] = useState<Array<{ts: string; level: string; message: string}>>([]);
  const [dockerError, setDockerError] = useState("");
  const [loadingDocker, setLoadingDocker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(0);

  // DB logs
  useQuery({
    queryKey: ["logs", agentId],
    queryFn: async () => { const d = await getAgentLogs(agentId, 500); initLogs(agentId, d); return d; },
    enabled: !!agentId && source === "db",
  });

  // Docker logs
  const fetchDockerLogs = async () => {
    setLoadingDocker(true); setDockerError("");
    try {
      const r = await getAgentDockerLogs(agentId, 200);
      if (r.error) setDockerError(r.error);
      else setDockerLogs(r.logs ?? []);
    } catch (e) {
      setDockerError((e as Error).message);
    } finally {
      setLoadingDocker(false);
    }
  };

  useEffect(() => {
    if (source === "docker") fetchDockerLogs();
  }, [source, agentId]);

  const activeLogs = source === "docker" ? dockerLogs : logs;

  useEffect(() => {
    if (autoScroll && activeLogs.length > prevLenRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLenRef.current = activeLogs.length;
  }, [activeLogs, autoScroll]);

  const filtered = activeLogs.filter((l) => {
    if (level !== "all" && l.level !== level) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap items-center">
        {/* Source toggle */}
        <div className="flex rounded-lg border border-(--color-border) overflow-hidden">
          {(["docker", "db"] as const).map((s) => (
            <button key={s} onClick={() => setSource(s)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${source === s ? "bg-(--color-accent) text-white" : "text-(--color-muted) hover:text-(--color-text)"}`}>
              {s === "docker" ? "Container logs" : "Run logs"}
            </button>
          ))}
        </div>
        <StyledSelect value={level} onChange={(e) => setLevel(e.target.value)} className="text-xs py-1.5">
          {["all","debug","info","warn","error"].map((l) => <option key={l}>{l}</option>)}
        </StyledSelect>
        <input className="flex-1 min-w-48 bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-1 focus:ring-(--color-accent)"
          placeholder="Search logs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="flex items-center gap-1.5 text-xs text-(--color-muted) cursor-pointer ml-auto">
          <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="accent-(--color-accent)" /> Auto-scroll
        </label>
        {source === "docker" && (
          <Button size="sm" variant="outline" onClick={fetchDockerLogs} disabled={loadingDocker}>
            {loadingDocker ? <Loader2 size={12} className="animate-spin" /> : "Refresh"}
          </Button>
        )}
        {source === "db" && (
          <Button size="sm" variant="ghost" onClick={() => initLogs(agentId, [])}>Clear</Button>
        )}
      </div>

      {dockerError && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">{dockerError}</div>
      )}

      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 h-[28rem] overflow-y-auto font-mono text-xs leading-5">
        {filtered.length === 0 && !loadingDocker && (
          <p className="text-gray-500 text-center mt-8">
            {source === "docker"
              ? "No container logs yet. Deploy the agent and send a message to see logs."
              : "No run logs yet."}
          </p>
        )}
        {loadingDocker && (
          <div className="flex items-center justify-center mt-8 gap-2 text-gray-500">
            <Loader2 size={14} className="animate-spin" /> Fetching container logs…
          </div>
        )}
        {filtered.map((l, i) => (
          <div key={i} className="flex gap-3 py-0.5 hover:bg-white/5 px-1 rounded">
            <span className="text-gray-500 shrink-0 tabular-nums">{l.ts ? new Date(l.ts).toLocaleTimeString() : ""}</span>
            <span className={`w-10 shrink-0 font-semibold ${LEVEL_CLS[l.level] ?? "text-gray-400"}`}>{l.level}</span>
            <span className="text-gray-200 break-all">{l.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function RunsTab({ agentId }: { agentId: string }) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const PER_PAGE = 20;
  const { data: runs, isLoading, error, refetch } = useQuery({ queryKey: ["runs", agentId], queryFn: () => getAgentRuns(agentId) });
  if (isLoading) return <LoadingSkeleton rows={3} />;
  if (error) return <ErrorCard message={(error as Error).message} onRetry={refetch} />;
  const paged = (runs ?? []).slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const total = Math.ceil((runs?.length ?? 0) / PER_PAGE);
  return (
    <div>
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-(--color-border)">
            <tr className="text-xs text-(--color-muted)">
              {["Started","Trigger","Duration","Status","Output"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {paged.map((r) => {
              const dur = r.ended_at ? `${Math.round((new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()) / 1000)}s` : "running";
              const preview = JSON.stringify(r.output ?? "").slice(0, 60);
              return (
                <>
                  <tr key={r.id} className="hover:bg-(--color-bg) cursor-pointer transition-colors" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                    <td className="px-4 py-3 text-(--color-muted)">{timeAgo(r.started_at)}</td>
                    <td className="px-4 py-3 text-(--color-text)">{r.trigger_type}</td>
                    <td className="px-4 py-3 text-(--color-muted)">{dur}</td>
                    <td className="px-4 py-3"><Badge label={r.status} /></td>
                    <td className="px-4 py-3 text-(--color-muted) font-mono text-xs truncate max-w-xs">{preview}</td>
                  </tr>
                  {expanded === r.id && (
                    <tr key={`${r.id}-exp`}>
                      <td colSpan={5} className="px-4 py-3 bg-(--color-bg)">
                        <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap">{JSON.stringify(r.output, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <div className="flex justify-end gap-2 mt-3">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span className="text-xs text-(--color-muted) self-center">{page + 1} / {total}</span>
          <Button size="sm" variant="outline" disabled={page >= total - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}

function ConfigTab({ agent }: { agent: import("../types").Agent }) {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: agent.name,
    description: agent.description,
    system_prompt: agent.system_prompt,
    temperature: agent.temperature,
    purpose_tag: agent.purpose_tag,
  });

  const updateMut = useMutation({
    mutationFn: (d: typeof form) => updateAgent(agent.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent", agent.id] });
      setEditing(false);
      setSaved(true);
      toast("Agent config saved — redeploy to apply changes");
      setTimeout(() => setSaved(false), 5000);
    },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const maskConfig = (cfg: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, MASK_KEYS.test(k) ? "***" : v]));

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* Redeploy notice */}
      {saved && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <RotateCcw size={15} className="text-amber-500 shrink-0" />
          <span className="text-amber-700">Config saved. Redeploy the agent from the Farm page to apply changes.</span>
        </div>
      )}

      {/* Identity */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider">Identity</p>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil size={12} /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setForm({ name: agent.name, description: agent.description, system_prompt: agent.system_prompt, temperature: agent.temperature, purpose_tag: agent.purpose_tag }); }}>
                <X size={12} /> Cancel
              </Button>
              <Button size="sm" onClick={() => updateMut.mutate(form)} disabled={updateMut.isPending}>
                <Save size={12} /> {updateMut.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Name</label>
              <input className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Description</label>
              <input className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">System Prompt</label>
              <textarea rows={8}
                className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent) resize-none font-mono"
                value={form.system_prompt} onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1">Temperature: {form.temperature}</label>
              <input type="range" min={0} max={1} step={0.1} value={form.temperature}
                onChange={e => setForm(f => ({ ...f, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-(--color-accent)" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Row label="Name">{agent.name}</Row>
            <Row label="Purpose">{agent.purpose_tag}</Row>
            <Row label="Provider">{agent.provider}</Row>
            <Row label="Model">{agent.model_name}</Row>
            <Row label="Temperature">{agent.temperature}</Row>
          </div>
        )}
      </div>

      {/* System Prompt (read-only when not editing) */}
      {!editing && (
        <Section title="System Prompt">
          <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap bg-(--color-bg) p-3 rounded-lg border border-(--color-border) leading-relaxed">{agent.system_prompt || "—"}</pre>
        </Section>
      )}

      {/* Tools */}
      {agent.tools.length > 0 && (
        <Section title="Tools">
          {agent.tools.map((t) => (
            <div key={t.id} className="mb-3">
              <div className="flex items-center gap-2 mb-1"><Badge label={t.tool_type} /><span className="text-sm font-medium text-(--color-text)">{t.display_name || t.name}</span></div>
              <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap bg-(--color-bg) p-2 rounded border border-(--color-border)">{JSON.stringify(maskConfig(t.config), null, 2)}</pre>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
      <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-4">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

interface ChatMessage { role: "user" | "assistant"; content: string; type?: string; }

function _friendlyError(raw: string): string {
  if (raw.includes("tool_use_failed") || raw.includes("failed_generation"))
    return "The model had trouble formatting a tool call. This is a known issue with some Groq models — try rephrasing your request or switching to mixtral-8x7b-32768.";
  if (raw.includes("rate_limit") || raw.includes("429"))
    return "Rate limit reached. Please wait a moment and try again.";
  if (raw.includes("quota") || raw.includes("exhausted"))
    return "Daily quota exhausted. Switch to a different model or API key.";
  if (raw.includes("system_prompt is required"))
    return "Agent has no system prompt configured. Edit the Config tab to add one.";
  // Strip long technical prefixes like "litellm.BadRequestError: GroqException - {...}"
  const jsonMatch = raw.match(/"message":"([^"]+)"/);
  if (jsonMatch) return jsonMatch[1];
  return raw.length > 200 ? raw.slice(0, 200) + "…" : raw;
}

function ChatTab({ agent }: { agent: import("../types").Agent }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const serviceUrl = agent.server_host || "http://localhost:8001";
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMsgLen = useRef(0);
  const isRunning = agent.status === "running";

  useEffect(() => {
    // Only scroll when new messages arrive, not on tab switch
    if (messages.length > prevMsgLen.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgLen.current = messages.length;
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setStreaming(true);
    let assistantContent = "";
    const assistantIdx = messages.length + 1;
    try {
      const res = await fetch(`${serviceUrl}/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, agent_id: agent.id, agent_name: agent.name, session_id: sessionId }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      setMessages(prev => [...prev, { role: "assistant", content: "", type: "streaming" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const ev = JSON.parse(line.slice(6));
            if (ev.type === "text_delta") {
              assistantContent += ev.content;
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: assistantContent } : m));
            } else if (ev.type === "final") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: ev.content, type: "done" } : m));
            } else if (ev.type === "tool_call") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: assistantContent + `\n\n🔧 ${ev.tool}` } : m));
            } else if (ev.type === "error") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: _friendlyError(ev.content), type: "error" } : m));
            }
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: _friendlyError((e as Error).message), type: "error" }]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {/* Service info card */}
      <div className="flex items-center gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-3">
        <div className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? "bg-green-500" : "bg-(--color-muted)"}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-(--color-muted)">Agent endpoint</p>
          <p className="text-sm font-mono text-(--color-text) truncate">{serviceUrl}</p>
        </div>
        <Badge label={agent.status} />
      </div>

      {!isRunning && (
        <div className="flex items-center gap-2 px-4 py-3 bg-(--color-surface) border border-amber-300 rounded-xl text-sm">
          <AlertCircle size={15} className="text-amber-500 shrink-0" />
          <span className="text-(--color-muted)">Agent is not running. Deploy it from the farm to enable chat.</span>
        </div>
      )}

      {/* Chat window */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl flex flex-col" style={{ height: "32rem" }}>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 bg-(--color-border) rounded-2xl flex items-center justify-center">
                <Send size={18} className="text-(--color-muted)" />
              </div>
              <p className="text-sm text-(--color-muted)">Start a conversation with <span className="font-medium text-(--color-text)">{agent.name}</span></p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-(--color-accent) text-white rounded-br-sm"
                  : m.type === "error"
                    ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-sm"
                    : "bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-bl-sm"
              }`}>
                {m.content || (m.type === "streaming" ? "" : "…")}
                {m.type === "streaming" && (
                  <span className="inline-flex gap-0.5 ml-1">
                    {[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-(--color-accent) rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-(--color-border) p-4 flex gap-3">
          <input
            className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            placeholder={isRunning ? `Message ${agent.name}…` : "Deploy agent to enable chat"}
            value={input}
            disabled={!isRunning || streaming}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          />
          <Button onClick={send} disabled={!isRunning || streaming || !input.trim()} className="px-4">
            {streaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
