export type AgentStatus  = "running" | "stopped" | "error" | "pulling" | "pending" | "idle" | "draft";
export type TargetType   = "dedicated_servers" | "kubernetes" | "cloud";
export type ConnType     = "ssh" | "docker_api";
export type ToolType     = "mcp" | "openapi" | "function";
export type TriggerType  = "webhook" | "schedule" | "event" | "manual";
export type CredType     = "oauth" | "static" | "ssh_key";
export type Toolkit      = "LangGraph" | "CrewAI" | "AutoGen" | "Google ADK" | "LangChain" | "Custom";

export interface Farm {
  id: string;
  name: string;
  description: string;
  target_type: TargetType;
  deploy_strategy: "build" | "pull";
  docker_image: string;
  registry_user: string;
  registry_token: string;
  created_at: string;
}

export interface Agent {
  id: string;
  farm_id: string | null;
  name: string;
  description: string;
  status: AgentStatus;
  toolkit: Toolkit;
  framework: string;
  config: Record<string, any>;
  model_id: string;
  model_name: string;
  provider: string;
  server_host: string;
  container_id: string;
  deployed_at: string;
  assigned_at: string | null;
  uptime_seconds: number;
  last_run: string;
  tool_count: number;
  purpose_tag: string;
  system_prompt: string;
  trigger_type: TriggerType;
  trigger_config: Record<string, unknown>;
  tools: AgentTool[];
  temperature: number;
  image: string;
}

export interface AgentTool {
  id: string;
  tool_type: ToolType;
  name: string;
  display_name: string;
  config: Record<string, unknown>;
  source_type?: string | null;
  source_id?: string | null;
}

export interface Server {
  id: string;
  farm_id: string;
  host: string;
  port: number;
  ssh_user: string;
  conn_type: ConnType;
  ssh_credential_id: string | null;
  container_count: number;
  labels: Record<string, string>;
  last_tested_at: string;
  maintenance: boolean;
  status: "online" | "offline" | "unknown" | "maintenance";
}

export interface Credential {
  id: string;
  farm_id: string;
  name: string;
  provider: string;
  cred_type: CredType;
  created_at: string;
}

export interface LLM {
  id: string;
  provider: string;
  model_name: string;
  display_name: string;
  is_default: boolean;
  is_global: boolean;
}

export interface Tool {
  id: string;
  name: string;
  display_name: string;
  tool_type: ToolType;
  description: string;
  categories: string[];
  config_schema: Record<string, unknown>;
}

export interface McpServer {
  id: string;
  name: string;
  display_name: string;
  url: string;
  auth_type: string;
  auth_header_ref: string | null;
  nango_connection_id: string | null;
  description: string;
  categories: string[];
  health_status: "healthy" | "unhealthy" | "unknown";
  last_checked_at: string | null;
  created_at: string;
}

export interface McpHealthResult {
  healthy: boolean;
  tool_count: number;
  latency_ms: number;
  tools: Array<{ name: string; description?: string }>;
  error?: string | null;
}

export interface OpenApiSpec {
  id: string;
  name: string;
  display_name: string;
  spec_url: string;
  spec_content: Record<string, unknown> | null;
  auth_type: string;
  auth_header_ref: string | null;
  description: string;
  categories: string[];
  last_synced_at: string | null;
  created_at: string;
}

export interface OpenApiEndpoint {
  method: string;
  path: string;
  operation_id: string | null;
  summary: string | null;
  parameter_count: number;
}

export interface AgentSkill {
  id: string;
  name: string;
  display_name: string;
  description: string;
  system_prompt_fragment: string;
  tools: Array<{ source_type: string; source_id: string; tool_names: string[] }>;
  default_config: Record<string, unknown>;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface AgentRun {
  id: string;
  agent_id: string;
  started_at: string;
  ended_at: string | null;
  trigger_type: TriggerType;
  status: "running" | "success" | "error";
  output: unknown;
}

export interface LogLine {
  ts: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
}

export interface AppEvent {
  id: string;
  type: string;
  agent_name?: string;
  server_name?: string;
  farm_name?: string;
  ts: string;
}
