import { useState, useEffect, useRef } from "react";
import { useToastStore } from "../store/useToastStore";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgent, stopAgent, restartAgent, deleteAgent, getAgentRuns, getAgentLogs } from "../api/client";
import { LoadingSkeleton, ErrorCard, Tabs, Badge, Button, ConfirmDialog } from "../components/ui";
import { useLogStore } from "../store/useLogStore";
import { timeAgo, formatUptime } from "../lib/time";
import { StopCircle, RefreshCw, Trash2, AlertCircle, Send, Loader2 } from "lucide-react";

const TABS = ["Overview", "Chat", "Logs", "Runs", "Config"];
const MASK_KEYS = /key|token|secret|password/i;

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);
  const [tab, setTab] = useState("Overview");
  const [confirm, setConfirm] = useState(false);

  const { data: agent, isLoading, error, refetch } = useQuery({
    queryKey: ["agent", agentId], queryFn: () => getAgent(agentId!), enabled: !!agentId,
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

  return (
    <div className="p-8 w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text)">{agent.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge label={agent.status} />
            <Badge label={agent.toolkit} />
            <Badge label={agent.model_name} />
            <span className="text-xs text-(--color-muted)">up {formatUptime(agent.uptime_seconds)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => stopMut.mutate()} disabled={stopMut.isPending}><StopCircle size={13} /> Stop</Button>
          <Button variant="outline" size="sm" onClick={() => restartMut.mutate()} disabled={restartMut.isPending}><RefreshCw size={13} /> Restart</Button>
          <Button variant="danger"  size="sm" onClick={() => setConfirm(true)}><Trash2 size={13} /> Delete</Button>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === "Overview" && <OverviewTab agent={agent} />}
        {tab === "Chat"     && <ChatTab agent={agent} />}
        {tab === "Logs"     && <LogsTab agentId={agentId!} />}
        {tab === "Runs"     && <RunsTab agentId={agentId!} />}
        {tab === "Config"   && <ConfigTab agent={agent} />}
      </div>

      {confirm && <ConfirmDialog message={`Delete agent "${agent.name}"?`} onConfirm={() => deleteMut.mutate()} onCancel={() => setConfirm(false)} />}
    </div>
  );
}

function OverviewTab({ agent }: { agent: import("../types").Agent }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 flex flex-col gap-3">
        <Row label="Farm"><Link to={`/farms/${agent.farm_id}`} className="text-(--color-accent) hover:underline text-sm">{agent.farm_id}</Link></Row>
        <Row label="Server">{agent.server_host}</Row>
        <Row label="Container">{agent.container_id.slice(0, 12)}…</Row>
        <Row label="Deployed">{timeAgo(agent.deployed_at)}</Row>
        <Row label="Trigger">{agent.trigger_type}</Row>
        <Row label="Tools">
          <div className="flex flex-col gap-1 mt-1">
            {agent.tools.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <Badge label={t.tool_type} />
                <span className="text-xs text-(--color-text)">{t.display_name}</span>
              </div>
            ))}
          </div>
        </Row>
      </div>
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6">
        <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-4">Trigger Config</p>
        <pre className="text-xs text-(--color-text) font-mono whitespace-pre-wrap break-all">{JSON.stringify(agent.trigger_config, null, 2)}</pre>
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

function LogsTab({ agentId }: { agentId: string }) {
  const { initLogs } = useLogStore();
  const logs = useLogStore((s) => s.logs[agentId] ?? []);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useQuery({
    queryKey: ["logs", agentId],
    queryFn: async () => { const d = await getAgentLogs(agentId, 500); initLogs(agentId, d); return d; },
    enabled: !!agentId,
  });

  useEffect(() => { if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs, autoScroll]);

  const filtered = logs.filter((l) => {
    if (level !== "all" && l.level !== level) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap">
        <select className="bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-xs text-(--color-text) focus:outline-none" value={level} onChange={(e) => setLevel(e.target.value)}>
          {["all","debug","info","warn","error"].map((l) => <option key={l}>{l}</option>)}
        </select>
        <input className="bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-xs text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-1 focus:ring-(--color-accent)" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="flex items-center gap-1.5 text-xs text-(--color-muted) cursor-pointer">
          <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="accent-(--color-accent)" /> Auto-scroll
        </label>
        <Button size="sm" variant="ghost" onClick={() => initLogs(agentId, [])}>Clear</Button>
      </div>
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 h-96 overflow-y-auto font-mono text-xs">
        {filtered.map((l, i) => (
          <div key={i} className="flex gap-3 py-0.5">
            <span className="text-(--color-muted) shrink-0">{new Date(l.ts).toLocaleTimeString()}</span>
            <span className={`w-10 shrink-0 font-semibold ${LEVEL_CLS[l.level]}`}>{l.level}</span>
            <span className="text-(--color-text) break-all">{l.message}</span>
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
  const maskConfig = (cfg: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, MASK_KEYS.test(k) ? "***" : v]));

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Section title="Identity">
        <Row label="Name">{agent.name}</Row>
        <Row label="Purpose">{agent.purpose_tag}</Row>
        <Row label="Image">{agent.image}</Row>
      </Section>
      <Section title="LLM Config">
        <Row label="Provider">{agent.provider}</Row>
        <Row label="Model">{agent.model_name}</Row>
        <Row label="Temperature">{agent.temperature}</Row>
      </Section>
      <Section title="System Prompt">
        <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap bg-(--color-bg) p-3 rounded-lg border border-(--color-border)">{agent.system_prompt}</pre>
      </Section>
      <Section title="Tools">
        {agent.tools.map((t) => (
          <div key={t.id} className="mb-3">
            <div className="flex items-center gap-2 mb-1"><Badge label={t.tool_type} /><span className="text-sm font-medium text-(--color-text)">{t.display_name}</span></div>
            <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap bg-(--color-bg) p-2 rounded border border-(--color-border)">{JSON.stringify(maskConfig(t.config), null, 2)}</pre>
          </div>
        ))}
      </Section>
      <Section title="Trigger">
        <Row label="Type">{agent.trigger_type}</Row>
        <pre className="text-xs font-mono text-(--color-text) whitespace-pre-wrap bg-(--color-bg) p-3 rounded-lg border border-(--color-border) mt-2">{JSON.stringify(agent.trigger_config, null, 2)}</pre>
      </Section>
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

// ── Chat Tab ──────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  type?: string;
}

function ChatTab({ agent }: { agent: import("../types").Agent }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [serviceUrl, setServiceUrl] = useState("http://localhost:8001");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        body: JSON.stringify({
          message: msg,
          agent_id: agent.id,
          agent_name: agent.name,
          session_id: sessionId,
        }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { role: "assistant", content: "…", type: "streaming" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "text_delta") {
              assistantContent += event.content;
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: assistantContent } : m));
            } else if (event.type === "final") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: event.content, type: "done" } : m));
            } else if (event.type === "tool_call") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx
                ? { ...m, content: assistantContent + `\n\n🔧 Calling tool: ${event.tool}` }
                : m));
            } else if (event.type === "error") {
              setMessages(prev => prev.map((m, i) => i === assistantIdx ? { ...m, content: `Error: ${event.content}`, type: "error" } : m));
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      setMessages(prev => [...prev, { role: "assistant", content: `Failed to reach agent service at ${serviceUrl}. Is it running?\n\n${errMsg}`, type: "error" }]);
    } finally {
      setStreaming(false);
    }
  };

  const isRunning = agent.status === "running";

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      {!isRunning && (
        <div className="flex items-center gap-2 px-4 py-3 bg-(--color-surface) border border-amber-300 rounded-xl text-sm">
          <AlertCircle size={15} className="text-amber-500 shrink-0" />
          <span className="text-(--color-muted)">Agent is not running. Deploy it first to enable chat.</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-xs text-(--color-muted) shrink-0">Agent service:</label>
        <input
          className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-xs text-(--color-text) focus:outline-none focus:ring-1 focus:ring-(--color-accent)"
          value={serviceUrl}
          onChange={e => setServiceUrl(e.target.value)}
          placeholder="http://localhost:8001"
        />
      </div>

      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 h-96 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-xs text-(--color-muted) text-center mt-8">Send a message to start chatting with {agent.name}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-(--color-accent) text-white"
                : m.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-(--color-bg) border border-(--color-border) text-(--color-text)"
            }`}>
              {m.content}
              {m.type === "streaming" && <span className="inline-block w-1.5 h-3.5 bg-(--color-accent) ml-1 animate-pulse" />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-1 focus:ring-(--color-accent)"
          placeholder={isRunning ? "Message the agent…" : "Deploy agent to enable chat"}
          value={input}
          disabled={!isRunning || streaming}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
        />
        <Button onClick={send} disabled={!isRunning || streaming || !input.trim()}>
          {streaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </Button>
      </div>
    </div>
  );
}
