import type { Farm, Agent, Server, Credential, LLM, Tool, AgentRun, LogLine, McpServer, McpHealthResult, OpenApiSpec, OpenApiEndpoint, AgentSkill } from "../types";

const BASE = import.meta.env.VITE_API_URL ?? "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    // Try to get the detail message from FastAPI error response
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") return undefined as T;
  return res.json() as Promise<T>;
}

// ── Farms ─────────────────────────────────────────────────────────────────────
export const getFarms   = ()                           => req<Farm[]>("/api/farms");
export const getFarm    = (id: string)                 => req<Farm>(`/api/farms/${id}`);
export const createFarm = (d: Partial<Farm>)           => req<Farm>("/api/farms", { method: "POST", body: JSON.stringify(d) });
export const updateFarm = (id: string, d: Partial<Farm>) => req<Farm>(`/api/farms/${id}`, { method: "PATCH", body: JSON.stringify(d) });
export const deleteFarm = (id: string)                 => req<void>(`/api/farms/${id}`, { method: "DELETE" });

// ── Agents ────────────────────────────────────────────────────────────────────
export const getAgents      = (farmId: string)         => req<Agent[]>(`/api/farms/${farmId}/agents`);
export const getAllAgents    = (params?: Record<string, string>) => req<Agent[]>(`/api/agents${params ? "?" + new URLSearchParams(params) : ""}`);
export const getAgent       = (id: string)             => req<Agent>(`/api/agents/${id}`);
export const createAgent    = (d: unknown)             => req<Agent>("/api/agents", { method: "POST", body: JSON.stringify(d) });
export const deployAgent    = (id: string)             => req<void>(`/api/agents/${id}/deploy`, { method: "POST" });
export const stopAgent      = (id: string)             => req<void>(`/api/agents/${id}/stop`, { method: "POST" });
export const restartAgent   = (id: string)             => req<void>(`/api/agents/${id}/restart`, { method: "POST" });
export const deleteAgent    = (id: string)             => req<void>(`/api/agents/${id}`, { method: "DELETE" });
export const assignAgent    = (id: string, d: { farm_id: string; environment_id?: string }) => req<Agent>(`/api/agents/${id}/assign`, { method: "POST", body: JSON.stringify(d) });
export const unassignAgent  = (id: string)             => req<Agent>(`/api/agents/${id}/assign`, { method: "DELETE" });
export const getAgentRuns   = (id: string)             => req<AgentRun[]>(`/api/agents/${id}/runs`);
export const getAgentLogs   = (id: string, n = 500)    => req<LogLine[]>(`/api/agents/${id}/logs?limit=${n}`);
export const getAgentSkills = (id: string)             => req<AgentSkill[]>(`/api/agents/${id}/skills`);
export const applySkill     = (agentId: string, skillId: string, d?: unknown) => req<Agent>(`/api/agents/${agentId}/skills/${skillId}`, { method: "POST", body: JSON.stringify(d ?? {}) });
export const removeSkill    = (agentId: string, skillId: string) => req<Agent>(`/api/agents/${agentId}/skills/${skillId}`, { method: "DELETE" });

// ── Servers ───────────────────────────────────────────────────────────────────
export const getServers     = (farmId: string)         => req<Server[]>(`/api/farms/${farmId}/servers`);
export const createServer   = (farmId: string, d: unknown) => req<Server>(`/api/farms/${farmId}/servers`, { method: "POST", body: JSON.stringify(d) });
export const testServer     = (id: string)             => req<{ latency_ms: number; docker_version: string; disk_free_gb: number }>(`/api/servers/${id}/test`, { method: "POST" });
export const setMaintenance = (id: string, v: boolean) => req<Server>(`/api/servers/${id}/maintenance`, { method: "PATCH", body: JSON.stringify({ maintenance: v }) });
export const deleteServer   = (id: string)             => req<void>(`/api/servers/${id}`, { method: "DELETE" });

// ── Credentials ───────────────────────────────────────────────────────────────
export const getCredentials   = (farmId: string)       => req<Credential[]>(`/api/farms/${farmId}/credentials`);
export const createCredential = (farmId: string, d: unknown) => req<Credential>(`/api/farms/${farmId}/credentials`, { method: "POST", body: JSON.stringify(d) });
export const testCredential   = (id: string)           => req<{ ok: boolean }>(`/api/credentials/${id}/test`, { method: "POST" });
export const deleteCredential = (id: string)           => req<void>(`/api/credentials/${id}`, { method: "DELETE" });

// ── LLMs (global) ─────────────────────────────────────────────────────────────
export const getLLMs          = (params?: Record<string, string>) => req<LLM[]>(`/api/llms${params ? "?" + new URLSearchParams(params) : ""}`);
export const createLLM        = (d: unknown)           => req<LLM>("/api/llms", { method: "POST", body: JSON.stringify(d) });
export const deleteLLM        = (id: string)           => req<void>(`/api/llms/${id}`, { method: "DELETE" });
export const getLLMAgents     = (id: string)           => req<unknown[]>(`/api/llms/${id}/agents`);
export const getFarmLLMs      = (farmId: string)       => req<LLM[]>(`/api/farms/${farmId}/llms`);
export const assignLLMToFarm  = (farmId: string, llmId: string, d: { is_default: boolean }) => req<LLM>(`/api/farms/${farmId}/llms/${llmId}`, { method: "POST", body: JSON.stringify(d) });
export const unassignLLMFromFarm = (farmId: string, llmId: string) => req<void>(`/api/farms/${farmId}/llms/${llmId}`, { method: "DELETE" });

// ── Tools ─────────────────────────────────────────────────────────────────────
export const getTools     = ()                         => req<Tool[]>("/api/tools");
export const registerTool = (d: unknown)               => req<Tool>("/api/tools", { method: "POST", body: JSON.stringify(d) });
export const deleteTool    = (id: string)                  => req<void>(`/api/tools/${id}`, { method: "DELETE" });

// ── MCP Servers ───────────────────────────────────────────────────────────────
export const getMcpServers    = (params?: Record<string, string>) => req<McpServer[]>(`/api/mcp-servers${params ? "?" + new URLSearchParams(params) : ""}`);
export const createMcpServer  = (d: unknown)           => req<McpServer>("/api/mcp-servers", { method: "POST", body: JSON.stringify(d) });
export const updateMcpServer  = (id: string, d: unknown) => req<McpServer>(`/api/mcp-servers/${id}`, { method: "PATCH", body: JSON.stringify(d) });
export const deleteMcpServer  = (id: string)           => req<void>(`/api/mcp-servers/${id}`, { method: "DELETE" });
export const checkMcpHealth   = (id: string)           => req<McpHealthResult>(`/api/mcp-servers/${id}/health-check`, { method: "POST" });
export const getMcpTools      = (id: string)           => req<unknown[]>(`/api/mcp-servers/${id}/tools`);

// ── OpenAPI Specs ─────────────────────────────────────────────────────────────
export const getOpenApiSpecs    = (params?: Record<string, string>) => req<OpenApiSpec[]>(`/api/openapi-specs${params ? "?" + new URLSearchParams(params) : ""}`);
export const createOpenApiSpec  = (d: unknown)         => req<OpenApiSpec>("/api/openapi-specs", { method: "POST", body: JSON.stringify(d) });
export const syncOpenApiSpec    = (id: string)         => req<OpenApiSpec>(`/api/openapi-specs/${id}/sync`, { method: "POST" });
export const getOpenApiEndpoints= (id: string)         => req<OpenApiEndpoint[]>(`/api/openapi-specs/${id}/endpoints`);
export const deleteOpenApiSpec  = (id: string)         => req<void>(`/api/openapi-specs/${id}`, { method: "DELETE" });

// ── Skills ────────────────────────────────────────────────────────────────────
export const getSkills      = (params?: Record<string, string>) => req<AgentSkill[]>(`/api/skills${params ? "?" + new URLSearchParams(params) : ""}`);
export const createSkill    = (d: unknown)             => req<AgentSkill>("/api/skills", { method: "POST", body: JSON.stringify(d) });
export const updateSkill    = (id: string, d: unknown) => req<AgentSkill>(`/api/skills/${id}`, { method: "PATCH", body: JSON.stringify(d) });
export const deleteSkill    = (id: string)             => req<void>(`/api/skills/${id}`, { method: "DELETE" });
