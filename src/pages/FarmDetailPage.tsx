import { useState, useRef, useEffect } from "react";
import { useToastStore } from "../store/useToastStore";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFarm, getAgents, getAllAgents, getServers, getCredentials,
  updateFarm, deleteFarm, createServer, deleteServer,
  testServer, setMaintenance, createCredential,
  testCredential, deleteCredential, unassignAgent,
} from "../api/client";
import {
  LoadingSkeleton, ErrorCard, EmptyState, Tabs, Badge, StatusDot,
  Button, Input, Textarea, Modal, ConfirmDialog,
} from "../components/ui";
import { timeAgo } from "../lib/time";
import {
  Plus, Bot, Server, Key, Trash2, StopCircle,
  AlertCircle, Terminal, Loader2, CheckCircle, XCircle, LogOut, RefreshCw,
} from "lucide-react";

const TABS = ["Agents", "Servers", "Credentials", "Settings"];

export default function FarmDetailPage() {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Agents");

  const { data: farm, isLoading, error, refetch } = useQuery({
    queryKey: ["farm", farmId], queryFn: () => getFarm(farmId!), enabled: !!farmId,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!farm) return (
    <div className="p-8">
      <div className="flex items-center gap-3 px-4 py-3 bg-(--color-surface) border border-red-300 rounded-xl text-sm max-w-lg">
        <AlertCircle size={16} className="text-red-500 shrink-0" />
        <span className="text-(--color-text-sub) flex-1">{(error as Error)?.message ?? "Farm not found"}</span>
        <button onClick={() => refetch()} className="text-xs text-(--color-accent) hover:underline">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="p-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">{farm.name}</h1>
        <p className="text-sm text-(--color-muted) mt-0.5">{farm.target_type}</p>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === "Agents"      && <AgentsTab farmId={farmId!} />}
        {tab === "Servers"     && <ServersTab farmId={farmId!} />}
        {tab === "Credentials" && <CredentialsTab farmId={farmId!} />}
        {tab === "Settings"    && <SettingsTab farm={farm} onDeleted={() => navigate("/farms")} />}
      </div>
    </div>
  );
}

// ── Deploy Terminal ───────────────────────────────────────────────────────────
type Stage = "info" | "cmd" | "log" | "success" | "error" | "done";
const STAGE_COLOR: Record<Stage, string> = {
  info: "text-blue-400", cmd: "text-yellow-300", log: "text-gray-400",
  success: "text-green-400", error: "text-red-400", done: "text-green-400",
};
const STAGE_PREFIX: Record<Stage, string> = {
  info: "›", cmd: "$", log: " ", success: "✓", error: "✗", done: "✓",
};

function AgentTerminal({
  agentId,
  agentName,
  wsPath,
  title,
  onDone,
}: {
  agentId: string;
  agentName: string;
  wsPath: string; // e.g. "deploy" | "stop" | "restart"
  title: string;
  onDone: () => void;
}) {
  const [lines, setLines] = useState<{ stage: Stage; message: string }[]>([]);
  const [status, setStatus] = useState<"connecting" | "running" | "done" | "error">("connecting");
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    const add = (stage: Stage, message: string) =>
      setLines(prev => [...prev, { stage, message }]);

    add("info", `${title} "${agentName}"…`);
    const ws = new WebSocket(`ws://${window.location.host}/ws/agents/${agentId}/${wsPath}`);
    wsRef.current = ws;

    ws.onopen = () => { setStatus("running"); add("info", "Connected"); };
    ws.onmessage = (ev) => {
      try {
        const e = JSON.parse(ev.data) as { stage: Stage; message: string };
        add(e.stage, e.message);
        if (e.stage === "done")  { setStatus("done");  setTimeout(onDone, 1000); }
        if (e.stage === "error") { setStatus("error"); }
      } catch { add("log", ev.data); }
    };
    ws.onerror = () => { add("error", "WebSocket connection failed"); setStatus("error"); };
    ws.onclose = (ev) => {
      if (ev.code !== 1000 && status === "running") {
        add("error", `Connection closed (${ev.code})`); setStatus("error");
      }
    };
    return () => ws.close();
  }, [agentId, wsPath]);

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden mt-3">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900">
        <Terminal size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400 font-mono">{title} · {agentName}</span>
        <div className="ml-auto">
          {status === "connecting" && <Loader2 size={12} className="animate-spin text-gray-400" />}
          {status === "running"    && <Loader2 size={12} className="animate-spin text-blue-400" />}
          {status === "done"       && <CheckCircle size={12} className="text-green-400" />}
          {status === "error"      && <XCircle size={12} className="text-red-400" />}
        </div>
      </div>
      <div className="p-4 h-48 overflow-y-auto font-mono text-xs leading-5">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <span className={`shrink-0 w-3 ${STAGE_COLOR[l.stage]}`}>{STAGE_PREFIX[l.stage]}</span>
            <span className={STAGE_COLOR[l.stage]}>{l.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ── Agents Tab ────────────────────────────────────────────────────────────────
function AgentsTab({ farmId }: { farmId: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);

  // Agents assigned to this farm
  const { data: agents, isLoading, error, refetch } = useQuery({
    queryKey: ["agents", farmId], queryFn: () => getAgents(farmId),
    refetchInterval: 30_000,  // sync with health monitor poll interval
  });
  // All draft agents (unassigned) for the assign modal
  const { data: allAgents } = useQuery({
    queryKey: ["agents-all", "unassigned"],
    queryFn: () => getAllAgents({ unassigned: "true" }),
  });

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignId, setAssignId] = useState("");
  const [terminalOp, setTerminalOp] = useState<{ id: string; op: "deploy" | "stop" | "restart" } | null>(null);
  const [unassignId, setUnassignId] = useState<string | null>(null);

  const assignMut = useMutation({
    mutationFn: (agentId: string) => import("../api/client").then(m => m.assignAgent(agentId, { farm_id: farmId })),
    onSuccess: (agent) => {
      qc.invalidateQueries({ queryKey: ["agents", farmId] });
      qc.invalidateQueries({ queryKey: ["agents-all"] });
      setAssignOpen(false);
      setAssignId("");
      toast(`"${agent.name}" assigned to farm`);
    },
    onError: (e) => toast((e as Error).message, "error"),
  });

  const unassignMut = useMutation({
    mutationFn: unassignAgent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agents", farmId] });
      qc.invalidateQueries({ queryKey: ["agents-all"] });
      setUnassignId(null);
      toast("Agent returned to library");
    },
    onError: (e) => { setUnassignId(null); toast((e as Error).message, "error"); },
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorCard message={(error as Error).message} onRetry={refetch} />;

  const draftAgents = allAgents ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setAssignOpen(true)}><Plus size={15} /> Assign from Library</Button>
      </div>

      {!agents?.length ? (
        <EmptyState
          icon={Bot}
          title="No agents assigned"
          description="Assign agents from the Library, then deploy them to this farm's servers."
          action={<Button onClick={() => setAssignOpen(true)}><Plus size={15} /> Assign from Library</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4">
              {/* Agent header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <button className="text-left" onClick={() => navigate(`/agents/${agent.id}`)}>
                    <p className="font-semibold text-sm text-(--color-text) hover:text-(--color-accent) transition-colors">{agent.name}</p>
                  </button>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge label={agent.status} />
                    <Badge label={agent.toolkit} />
                    {agent.model_name && <Badge label={agent.model_name} variant="idle" />}
                  </div>
                  {agent.server_host && (
                    <p className="text-xs text-(--color-muted) mt-1 font-mono">{agent.server_host}</p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {agent.status === "stopped" && !terminalOp && (
                    <Button size="sm" onClick={() => setTerminalOp({ id: agent.id, op: "deploy" })}>Deploy</Button>
                  )}
                  {agent.status === "running" && !terminalOp && (
                    <>
                      <Button size="sm" variant="outline"
                        onClick={() => setTerminalOp({ id: agent.id, op: "restart" })}>
                        <RefreshCw size={13} /> Restart
                      </Button>
                      <Button size="sm" variant="outline"
                        onClick={() => setTerminalOp({ id: agent.id, op: "stop" })}>
                        <StopCircle size={13} /> Stop
                      </Button>
                    </>
                  )}
                  {agent.status === "error" && !terminalOp && (
                    <Button size="sm" onClick={() => setTerminalOp({ id: agent.id, op: "deploy" })}>Retry Deploy</Button>
                  )}
                  {terminalOp?.id === agent.id && (
                    <span className="text-xs text-(--color-muted) flex items-center gap-1">
                      <Loader2 size={11} className="animate-spin" />
                      {terminalOp.op}…
                    </span>
                  )}
                  {(agent.status === "stopped" || agent.status === "draft") && !terminalOp && (
                    <button
                      onClick={() => setUnassignId(agent.id)}
                      title="Return to library"
                      className="p-1.5 rounded-lg text-(--color-muted) hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <LogOut size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline terminal for deploy/stop/restart */}
              {terminalOp?.id === agent.id && (
                <AgentTerminal
                  agentId={agent.id}
                  agentName={agent.name}
                  wsPath={terminalOp.op}
                  title={terminalOp.op.charAt(0).toUpperCase() + terminalOp.op.slice(1)}
                  onDone={() => {
                    setTerminalOp(null);
                    qc.invalidateQueries({ queryKey: ["agents", farmId] });
                    toast(`"${agent.name}" ${terminalOp.op} complete`);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assign modal */}
      {assignOpen && (
        <Modal title="Assign Agent from Library" onClose={() => { setAssignOpen(false); setAssignId(""); }}>
          <div className="flex flex-col gap-4">
            {!draftAgents.length ? (
              <div className="text-sm text-(--color-muted) py-4 text-center">
                No unassigned agents in the library.{" "}
                <button className="text-(--color-accent) hover:underline" onClick={() => navigate("/agents/new")}>
                  Create one first
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {draftAgents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAssignId(a.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors
                      ${assignId === a.id
                        ? "border-(--color-accent) bg-(--color-accent)/10"
                        : "border-(--color-border) hover:border-(--color-text)"}`}
                  >
                    <Bot size={15} className="text-(--color-muted) shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-(--color-text) truncate">{a.name}</p>
                      <p className="text-xs text-(--color-muted)">{a.toolkit} · {a.model_name || "no model"}</p>
                    </div>
                    <Badge label={a.status} />
                  </button>
                ))}
              </div>
            )}
            {assignMut.error && <p className="text-xs text-red-500">{(assignMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => { setAssignOpen(false); setAssignId(""); }}>Cancel</Button>
              <Button
                onClick={() => assignMut.mutate(assignId)}
                disabled={!assignId || assignMut.isPending}
              >
                {assignMut.isPending ? "Assigning…" : "Assign"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {unassignId && (
        <ConfirmDialog
          message={`Return "${agents?.find(a => a.id === unassignId)?.name}" to the library? It will be undeployed.`}
          onConfirm={() => { const id = unassignId!; setUnassignId(null); unassignMut.mutate(id); }}
          onCancel={() => setUnassignId(null)}
        />
      )}
    </div>
  );
}

// ── Servers Tab ───────────────────────────────────────────────────────────────
function ServersTab({ farmId }: { farmId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    host: "", port: "22", ssh_user: "ubuntu", conn_type: "ssh",
    ssh_credential_id: null as string | null,
  });

  const { data: servers, isLoading, error, refetch } = useQuery({ queryKey: ["servers", farmId], queryFn: () => getServers(farmId) });
  const { data: creds } = useQuery({ queryKey: ["credentials", farmId], queryFn: () => getCredentials(farmId) });
  const sshCreds = (creds ?? []);

  const createMut = useMutation({
    mutationFn: (d: unknown) => createServer(farmId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["servers", farmId] }); setOpen(false); },
  });
  const deleteMut = useMutation({ mutationFn: deleteServer, onSuccess: () => qc.invalidateQueries({ queryKey: ["servers", farmId] }) });
  const maintMut  = useMutation({
    mutationFn: ({ id, v }: { id: string; v: boolean }) => setMaintenance(id, v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers", farmId] }),
  });

  const runTest = async (id: string) => {
    setTestResults((p) => ({ ...p, [id]: "Testing…" }));
    try {
      const r = await testServer(id);
      setTestResults((p) => ({ ...p, [id]: `✓ ${r.latency_ms}ms · Docker ${r.docker_version} · ${r.disk_free_gb}GB free` }));
    } catch (e) {
      // Try to extract the detail message from the error response
      const msg = (e as Error).message;
      setTestResults((p) => ({ ...p, [id]: `✗ ${msg}` }));
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorCard message={(error as Error).message} onRetry={refetch} />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Server</Button>
      </div>
      {!servers?.length ? (
        <EmptyState icon={Server} title="No servers" description="Add a server with SSH access and Docker installed." />
      ) : (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-(--color-border)">
              <tr className="text-xs text-(--color-muted)">
                {["", "Host", "User", "Containers", "Last Tested", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {servers.map((s) => (
                <tr key={s.id} className="hover:bg-(--color-bg) transition-colors">
                  <td className="px-4 py-3"><StatusDot status={s.status} /></td>
                  <td className="px-4 py-3 font-medium text-(--color-text)">{s.host}:{s.port}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{s.ssh_user}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{s.container_count}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{s.last_tested_at ? timeAgo(s.last_tested_at) : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => runTest(s.id)}>Test SSH</Button>
                      <label className="flex items-center gap-1 text-xs cursor-pointer text-(--color-muted)">
                        <input type="checkbox" checked={s.maintenance}
                          onChange={() => maintMut.mutate({ id: s.id, v: !s.maintenance })}
                          className="accent-(--color-accent)" />
                        Maint.
                      </label>
                      <button onClick={() => setConfirmId(s.id)} className="text-(--color-muted) hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {testResults[s.id] && (
                      <p className={`text-xs mt-1 ${testResults[s.id].startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                        {testResults[s.id]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal title="Add Server" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Host *" value={form.host} onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))} placeholder="192.168.1.10 or my-server.com" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="SSH Port" value={form.port} onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))} />
              <Input label="SSH User" value={form.ssh_user} onChange={(e) => setForm((f) => ({ ...f, ssh_user: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1.5">SSH Credential (private key)</label>
              <select
                className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-1 focus:ring-(--color-accent)"
                value={form.ssh_credential_id ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, ssh_credential_id: e.target.value || null }))}
              >
                <option value="">None (passwordless SSH)</option>
                {sshCreds.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {!sshCreds.length && (
                <p className="text-xs text-(--color-muted) mt-1">Add an SSH Key credential in the Credentials tab first.</p>
              )}
            </div>
            {createMut.error && <p className="text-xs text-red-500">{(createMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => createMut.mutate({ host: form.host, port: Number(form.port), ssh_user: form.ssh_user, conn_type: form.conn_type, ssh_credential_id: form.ssh_credential_id, labels: {} })}
                disabled={!form.host || createMut.isPending}
              >
                {createMut.isPending ? "Adding…" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Delete this server?" onConfirm={() => { deleteMut.mutate(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── Credentials Tab ───────────────────────────────────────────────────────────
function CredentialsTab({ farmId }: { farmId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [form, setForm] = useState({ name: "", provider: "", secret: "", cred_type: "static" as "static" | "ssh_key" });

  const { data: creds, isLoading, error, refetch } = useQuery({ queryKey: ["credentials", farmId], queryFn: () => getCredentials(farmId) });
  const createMut = useMutation({
    mutationFn: (d: unknown) => createCredential(farmId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["credentials", farmId] }); setOpen(false); setForm({ name: "", provider: "", secret: "", cred_type: "static" }); },
  });
  const deleteMut = useMutation({ mutationFn: deleteCredential, onSuccess: () => qc.invalidateQueries({ queryKey: ["credentials", farmId] }) });

  const runTest = async (id: string) => {
    try { const r = await testCredential(id); setTestResults((p) => ({ ...p, [id]: r.ok })); }
    catch { setTestResults((p) => ({ ...p, [id]: false })); }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorCard message={(error as Error).message} onRetry={refetch} />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Credential</Button>
      </div>
      {!creds?.length ? (
        <EmptyState icon={Key} title="No credentials" description="Add an SSH key to enable server deployments." />
      ) : (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-(--color-border)">
              <tr className="text-xs text-(--color-muted)">
                {["Name", "Provider", "Type", "Created", "Actions"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {creds.map((c) => (
                <tr key={c.id} className="hover:bg-(--color-bg) transition-colors">
                  <td className="px-4 py-3 font-medium text-(--color-text)">{c.name}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{c.provider}</td>
                  <td className="px-4 py-3"><Badge label={c.cred_type} /></td>
                  <td className="px-4 py-3 text-(--color-muted)">{timeAgo(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => runTest(c.id)}>Test</Button>
                      {testResults[c.id] !== undefined && (
                        <span className={`text-xs ${testResults[c.id] ? "text-green-600" : "text-red-500"}`}>
                          {testResults[c.id] ? "OK" : "Fail"}
                        </span>
                      )}
                      <button onClick={() => setConfirmId(c.id)} className="text-(--color-muted) hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal title="Add Credential" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Provider" value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))} placeholder="e.g. ssh, github, aws" />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1.5">Type</label>
              <div className="flex gap-2">
                {(["static", "ssh_key"] as const).map((t) => (
                  <button key={t} onClick={() => setForm((f) => ({ ...f, cred_type: t }))}
                    className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${form.cred_type === t ? "border-(--color-accent) bg-(--color-accent) text-white" : "border-(--color-border) text-(--color-text)"}`}>
                    {t === "ssh_key" ? "SSH Key" : "API Key / Secret"}
                  </button>
                ))}
              </div>
            </div>
            {form.cred_type === "ssh_key" ? (
              <div>
                <label className="text-xs font-medium text-(--color-text-sub) block mb-1.5">Private Key (PEM)</label>
                <textarea rows={6}
                  className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-xs font-mono text-(--color-text) focus:outline-none focus:ring-1 focus:ring-(--color-accent) resize-none"
                  placeholder={"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"}
                  value={form.secret} onChange={(e) => setForm((f) => ({ ...f, secret: e.target.value }))} />
                <p className="text-xs text-(--color-muted) mt-1">Used for SSH access to deploy agent containers.</p>
              </div>
            ) : (
              <Input label="Secret" type="password" value={form.secret} onChange={(e) => setForm((f) => ({ ...f, secret: e.target.value }))} />
            )}
            {createMut.error && <p className="text-xs text-red-500">{(createMut.error as Error).message}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => createMut.mutate({ ...form })} disabled={!form.name || createMut.isPending}>
                {createMut.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Delete this credential?" onConfirm={() => { deleteMut.mutate(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ farm, onDeleted }: { farm: import("../types").Farm; onDeleted: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: farm.name,
    description: farm.description,
    deploy_strategy: farm.deploy_strategy ?? "build",
    docker_image: farm.docker_image ?? "",
    registry_user: farm.registry_user ?? "",
    registry_token: "",
    kubeconfig: "",  // never pre-fill sensitive data
  });
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateMut = useMutation({
    mutationFn: (d: Partial<import("../types").Farm>) => updateFarm(farm.id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farm", farm.id] }); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });
  const deleteMut = useMutation({ mutationFn: () => deleteFarm(farm.id), onSuccess: onDeleted });

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 flex flex-col gap-4">
        <Input label="Farm Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

        {/* Deploy strategy */}
        <div>
          <label className="text-xs font-medium text-(--color-text-sub) block mb-2">Deploy Strategy</label>
          <div className="flex gap-3">
            {(["build", "pull"] as const).map((s) => (
              <button key={s} onClick={() => setForm((f) => ({ ...f, deploy_strategy: s }))}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                  form.deploy_strategy === s
                    ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent)"
                    : "border-(--color-border) text-(--color-text) hover:border-(--color-text)"
                }`}>
                <p className="font-semibold">{s === "build" ? "Build on server" : "Pull from registry"}</p>
                <p className="text-xs text-(--color-muted) mt-0.5 font-normal">
                  {s === "build" ? "Clone repo & docker build (slower, no registry needed)" : "docker pull pre-built image (fast, requires registry)"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {form.deploy_strategy === "pull" && (
          <div className="flex flex-col gap-3 p-4 bg-(--color-bg) border border-(--color-border) rounded-xl">
            <Input
              label="Docker Image URL"
              value={form.docker_image}
              onChange={(e) => setForm((f) => ({ ...f, docker_image: e.target.value }))}
              placeholder="rockingcoder/greater-agents:latest"
            />
            <Input
              label="Registry Username"
              value={form.registry_user}
              onChange={(e) => setForm((f) => ({ ...f, registry_user: e.target.value }))}
              placeholder="your-username (leave blank for public images)"
            />
            <Input
              label="Registry Token / Password"
              type="password"
              value={form.registry_token}
              onChange={(e) => setForm((f) => ({ ...f, registry_token: e.target.value }))}
              placeholder="Leave blank for public images or to keep existing"
            />
          </div>
        )}

        {/* Kubernetes config */}
        {farm.target_type === "kubernetes" && (
          <div className="flex flex-col gap-3 p-4 bg-(--color-bg) border border-(--color-border) rounded-xl">
            <p className="text-xs font-semibold text-(--color-text-sub) uppercase tracking-wider">Kubernetes Config</p>
            <Input
              label="Docker Image (required for K8s)"
              value={form.docker_image}
              onChange={(e) => setForm((f) => ({ ...f, docker_image: e.target.value }))}
              placeholder="rockingcoder/greater-agents:latest"
            />
            <div>
              <label className="text-xs font-medium text-(--color-text-sub) block mb-1.5">Kubeconfig (YAML)</label>
              <textarea
                rows={8}
                className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-xs font-mono text-(--color-text) focus:outline-none focus:ring-1 focus:ring-(--color-accent) resize-none"
                placeholder={"apiVersion: v1\nclusters:\n- cluster:\n    server: https://...\n  name: lke-cluster\n..."}
                value={form.kubeconfig}
                onChange={(e) => setForm((f) => ({ ...f, kubeconfig: e.target.value }))}
              />
              <p className="text-xs text-(--color-muted) mt-1">
                Download from Linode Cloud Manager → Kubernetes → your cluster → Download kubeconfig.
                Leave blank to keep existing.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-(--color-muted) mb-1">Target Type</p><p className="text-(--color-text)">{farm.target_type}</p></div>
          <div><p className="text-xs text-(--color-muted) mb-1">Created</p><p className="text-(--color-text)">{timeAgo(farm.created_at)}</p></div>
          <div className="col-span-2"><p className="text-xs text-(--color-muted) mb-1">Farm ID</p><p className="text-(--color-text) font-mono text-xs">{farm.id}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => updateMut.mutate(form)} disabled={updateMut.isPending}>{updateMut.isPending ? "Saving…" : "Save"}</Button>
          {saved && <span className="text-xs text-(--color-accent)">Saved!</span>}
          {updateMut.error && <span className="text-xs text-red-500">{(updateMut.error as Error).message}</span>}
        </div>
      </div>
      <div className="bg-(--color-surface) border border-red-300 rounded-xl p-6">
        <p className="text-sm font-semibold text-(--color-text) mb-1">Danger Zone</p>
        <p className="text-xs text-(--color-muted) mb-4">Deleting a farm removes all server configs. Agents return to the library.</p>
        <Button variant="danger" onClick={() => setConfirm(true)}>Delete Farm</Button>
      </div>
      {confirm && <ConfirmDialog message={`Delete farm "${farm.name}"?`} onConfirm={() => deleteMut.mutate()} onCancel={() => setConfirm(false)} />}
    </div>
  );
}
