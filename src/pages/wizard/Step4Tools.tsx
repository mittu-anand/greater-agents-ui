import { useQuery } from "@tanstack/react-query";
import { getTools, getMcpServers } from "../../api/client";
import { useWizardStore } from "../../store/useWizardStore";
import { Badge, LoadingSkeleton } from "../../components/ui";
import { parseCron } from "../../lib/time";
import type { TriggerType } from "../../types";
import { Server, Wrench, ExternalLink } from "lucide-react";

const TRIGGERS: { type: TriggerType; label: string; desc: string }[] = [
  { type: "manual",   label: "Manual",   desc: "POST /run endpoint" },
  { type: "webhook",  label: "Webhook",  desc: "Triggered by HTTP POST" },
  { type: "schedule", label: "Schedule", desc: "Runs on a cron schedule" },
  { type: "event",    label: "Event",    desc: "Redis pub/sub topic" },
];

export default function Step4Tools({ farmId: _ }: { farmId: string }) {
  const { data, update } = useWizardStore();
  const { data: tools, isLoading: toolsLoading } = useQuery({ queryKey: ["tools"], queryFn: getTools });
  const { data: mcpServers, isLoading: mcpLoading } = useQuery({ queryKey: ["mcp-servers"], queryFn: () => getMcpServers() });

  const isLoading = toolsLoading || mcpLoading;

  // Toggle a generic tool
  const toggleTool = (id: string, type: import("../../types").ToolType) => {
    const exists = data.tools.find((t) => t.tool_id === id);
    if (exists) update({ tools: data.tools.filter((t) => t.tool_id !== id) });
    else update({ tools: [...data.tools, { tool_id: id, tool_type: type, config: {} }] });
  };

  // Toggle an MCP server — stored as tool_type="mcp", tool_id=mcp_server.id, config.url=mcp_server.url
  const toggleMcp = (mcpId: string, mcpUrl: string) => {
    const exists = data.tools.find((t) => t.tool_id === mcpId);
    if (exists) update({ tools: data.tools.filter((t) => t.tool_id !== mcpId) });
    else update({ tools: [...data.tools, { tool_id: mcpId, tool_type: "mcp", config: { url: mcpUrl } }] });
  };

  const isMcpSelected = (id: string) => !!data.tools.find((t) => t.tool_id === id);
  const isToolSelected = (id: string) => !!data.tools.find((t) => t.tool_id === id);

  return (
    <div className="flex flex-col gap-8">

      {/* MCP Servers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold text-(--color-text)">MCP Servers</h2>
            <p className="text-sm text-(--color-muted)">Select MCP servers to give this agent tool access.</p>
          </div>
          <a href="/mcp-servers" target="_blank" rel="noopener"
            className="flex items-center gap-1 text-xs text-(--color-accent) hover:underline">
            Manage <ExternalLink size={11} />
          </a>
        </div>

        {isLoading ? <LoadingSkeleton rows={1} /> : !mcpServers?.length ? (
          <div className="border border-dashed border-(--color-border) rounded-xl p-6 text-center">
            <Server size={20} className="text-(--color-muted) mx-auto mb-2" />
            <p className="text-sm text-(--color-muted)">No MCP servers registered yet.</p>
            <a href="/mcp-servers" target="_blank" rel="noopener"
              className="text-xs text-(--color-accent) hover:underline mt-1 inline-block">
              Register one in MCP Servers →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {mcpServers.map((mcp) => {
              const sel = isMcpSelected(mcp.id);
              return (
                <button key={mcp.id} onClick={() => toggleMcp(mcp.id, mcp.url)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors
                    ${sel
                      ? "border-(--color-accent) bg-(--color-accent)/10"
                      : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text)"}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    mcp.health_status === "healthy" ? "bg-green-500"
                    : mcp.health_status === "unhealthy" ? "bg-red-500"
                    : "bg-(--color-muted)"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${sel ? "text-(--color-accent)" : "text-(--color-text)"}`}>
                      {mcp.display_name}
                    </p>
                    <p className="text-xs text-(--color-muted) font-mono truncate">{mcp.url}</p>
                    {mcp.description && (
                      <p className="text-xs text-(--color-muted) mt-0.5 line-clamp-1">{mcp.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap shrink-0">
                    {mcp.categories.slice(0, 2).map((c) => (
                      <span key={c} className="text-xs bg-(--color-border) text-(--color-text-sub) px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  {sel && (
                    <span className="text-xs font-semibold text-(--color-accent) shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Show selected MCP servers summary */}
        {data.tools.filter(t => t.tool_type === "mcp").length > 0 && (
          <div className="mt-3 px-3 py-2 bg-(--color-surface) border border-(--color-border) rounded-lg">
            <p className="text-xs text-(--color-muted)">
              {data.tools.filter(t => t.tool_type === "mcp").length} MCP server(s) selected — agent will have access to all their tools
            </p>
          </div>
        )}
      </div>

      {/* Generic Tool Registry */}
      {(tools?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={15} className="text-(--color-muted)" />
            <h2 className="text-xl font-semibold text-(--color-text)">Tool Registry</h2>
          </div>
          <p className="text-sm text-(--color-muted) mb-4">Additional function tools.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(tools ?? []).map((t) => {
              const sel = isToolSelected(t.id);
              return (
                <button key={t.id} onClick={() => toggleTool(t.id, t.tool_type)}
                  className={`p-3 rounded-xl border text-left transition-colors
                    ${sel ? "border-(--color-accent) bg-(--color-accent)/10" : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text)"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={t.tool_type} />
                    <span className="text-xs font-semibold text-(--color-text)">{t.display_name}</span>
                  </div>
                  <p className="text-xs text-(--color-muted) line-clamp-2">{t.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger */}
      <div>
        <h2 className="text-xl font-semibold text-(--color-text) mb-1">Trigger</h2>
        <p className="text-sm text-(--color-muted) mb-4">How should this agent be invoked?</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {TRIGGERS.map(({ type, label, desc }) => (
            <button key={type} onClick={() => update({ trigger_type: type, trigger_config: {} })}
              className={`p-3 rounded-xl border text-left transition-colors
                ${data.trigger_type === type
                  ? "border-(--color-accent) bg-(--color-accent) text-white"
                  : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text)"}`}>
              <p className={`text-sm font-semibold ${data.trigger_type === type ? "text-white" : "text-(--color-text)"}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${data.trigger_type === type ? "text-white/80" : "text-(--color-muted)"}`}>{desc}</p>
            </button>
          ))}
        </div>

        {data.trigger_type === "webhook" && (
          <input className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            placeholder="/hooks/pr-merged" value={data.trigger_config.path ?? ""}
            onChange={(e) => update({ trigger_config: { path: e.target.value } })} />
        )}
        {data.trigger_type === "schedule" && (
          <div className="flex flex-col gap-2">
            <input className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              placeholder="0 9 * * 1-5" value={data.trigger_config.cron ?? ""}
              onChange={(e) => update({ trigger_config: { cron: e.target.value } })} />
            {data.trigger_config.cron && <p className="text-xs text-(--color-muted)">{parseCron(data.trigger_config.cron)}</p>}
          </div>
        )}
        {data.trigger_type === "event" && (
          <input className="w-full bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            placeholder="agent.events.pr_merged" value={data.trigger_config.topic ?? ""}
            onChange={(e) => update({ trigger_config: { topic: e.target.value } })} />
        )}
        {data.trigger_type === "manual" && (
          <p className="text-sm text-(--color-muted) bg-(--color-surface) border border-(--color-border) rounded-lg px-4 py-3">
            Agent triggered via POST /run or the Chat tab.
          </p>
        )}
      </div>
    </div>
  );
}
