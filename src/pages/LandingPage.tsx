import { Link } from "react-router-dom";
import { ArrowRight, Zap, Eye, Repeat2, Server, BarChart2, Sparkles, Shield, Bot, GitBranch, Database, Layers, Clock, Lock, RefreshCw, Search, Brain, Link2 } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#e3d6bc]/90 backdrop-blur border-b border-[#cfc4aa]">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Greater Agents" className="h-8 w-auto" />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-[#555555]">
        <a href="#platform" className="hover:text-[#111] transition-colors">Platform</a>
        <a href="#how-it-works" className="hover:text-[#111] transition-colors">How It Works</a>
        <a href="#use-cases" className="hover:text-[#111] transition-colors">Use Cases</a>
        <a href="#built-on" className="hover:text-[#111] transition-colors">Stack</a>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm text-[#555555] hover:text-[#111] transition-colors">Log in</Link>
        <Link to="/signup" className="text-sm bg-[#4e8565] text-white px-4 py-2 rounded-lg hover:bg-[#3d6b52] transition-colors">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-32 pb-24 px-8 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4e8565] bg-[#4e8565]/10 border border-[#4e8565]/20 px-3 py-1.5 rounded-full mb-8">
        <Zap size={11} /> Open Enterprise Platform for AI Agents
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-[#111] leading-tight mb-6">
        Deploy, Orchestrate and Scale<br />
        <span className="text-[#4e8565]">AI Agents</span> — Without the Complexity
      </h1>
      <p className="text-lg text-[#555555] max-w-2xl mx-auto mb-10 leading-relaxed">
        Greater Agents is an open enterprise platform for creating, deploying and managing intelligent AI agents across any infrastructure. Build once, run anywhere, scale to any team.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
        <Link to="/signup" className="flex items-center gap-2 bg-[#4e8565] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b52] transition-colors">
          Start Building <ArrowRight size={16} />
        </Link>
        <a href="https://github.com/mittu-anand/greater-agents-agent-service" target="_blank" rel="noopener"
          className="flex items-center gap-2 border border-[#cfc4aa] text-[#111] px-6 py-3 rounded-xl font-semibold hover:border-[#111] transition-colors bg-[#ede3ce]">
          <GithubIcon size={16} /> View on GitHub
        </a>
      </div>
      <p className="text-xs text-[#9e8e78] tracking-wide">
        Built on Google ADK · LiteLLM · MCP · A2A Protocol
      </p>
    </section>
  );
}

// ── Problem ───────────────────────────────────────────────────────────────────
function Problem() {
  const points = [
    { icon: Layers, title: "Scattered configs", body: "Agent prompts, models, tools and credentials live in different places with no single source of truth." },
    { icon: Eye, title: "No visibility", body: "Once deployed you have no idea what your agents are doing, which tools they called or why they failed." },
    { icon: Repeat2, title: "Zero reusability", body: "Every new agent is built from scratch. Skills, tool connections and configs cannot be shared or composed." },
  ];
  return (
    <section className="py-24 px-8 bg-[#111]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          AI agents are powerful.<br />Managing them is chaos.
        </h2>
        <p className="text-center text-[#888] mb-16 max-w-xl mx-auto">The tooling hasn't kept up with the ambition.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#4e8565]/20 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#4e8565]" />
              </div>
              <p className="font-semibold text-white mb-2">{title}</p>
              <p className="text-sm text-[#888] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Platform ──────────────────────────────────────────────────────────────────
function Platform() {
  const points = [
    { icon: Bot, title: "Agent Library", body: "Create and configure agents independently. Store system prompts, toolkits, LLM configs and trigger rules as reusable assets. Deploy to any farm when ready." },
    { icon: Server, title: "Farm Management", body: "Group agents into farms backed by dedicated servers, Kubernetes or cloud infrastructure. Deploy over SSH. No Kubernetes expertise required." },
    { icon: BarChart2, title: "Live Observability", body: "Real-time dashboard showing every agent's status, log stream, tool calls and run history as it happens." },
    { icon: Sparkles, title: "Skill System", body: "Package prompt fragments and tool bindings into reusable skills. Apply to any agent in seconds." },
  ];
  return (
    <section id="platform" className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">One platform. Every agent. Full control.</h2>
          <p className="text-[#555555] max-w-2xl mx-auto leading-relaxed">
            A complete control plane for the entire agent lifecycle — from creation to deployment to real-time monitoring — across any infrastructure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#ede3ce] border border-[#cfc4aa] rounded-2xl p-6 hover:border-[#4e8565] transition-colors">
              <div className="w-10 h-10 bg-[#4e8565]/15 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#4e8565]" />
              </div>
              <p className="font-semibold text-[#111] mb-2">{title}</p>
              <p className="text-sm text-[#555555] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "Register your infrastructure", body: "Add dedicated servers or connect a Kubernetes cluster. SSH keys and credentials stored in Vault — never in the database." },
    { n: "02", title: "Configure your LLMs and tools", body: "Add LLM providers. Register MCP servers and OpenAPI specs as reusable tool sources available to all agents." },
    { n: "03", title: "Build your agent", body: "Choose a toolkit, write the system prompt, apply skills, bind tools and set a trigger — webhook, schedule, event or manual." },
    { n: "04", title: "Deploy to a farm", body: "Assign the agent to a farm. The platform selects the best server, resolves all credentials from Vault, spins up the container and streams health status back live." },
    { n: "05", title: "Monitor and evolve", body: "Watch live logs, tool calls and run history. Update agent config without losing history. Chain agents together for multi-step autonomous workflows." },
  ];
  return (
    <section id="how-it-works" className="py-24 px-8 bg-[#111]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          From config to running agent in minutes
        </h2>
        <div className="flex flex-col gap-0">
          {steps.map(({ n, title, body }, i) => (
            <div key={n} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#4e8565] flex items-center justify-center text-white text-xs font-bold shrink-0">{n}</div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-[#4e8565]/30 my-2" />}
              </div>
              <div className="pb-10">
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-sm text-[#888] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── A2A ───────────────────────────────────────────────────────────────────────
function A2A() {
  const points = [
    { icon: Search, title: "Runtime agent discovery", body: "Agents find other agents by capability at runtime. No hardcoded routing. No static chains." },
    { icon: GitBranch, title: "Skill-based delegation", body: "Agents expose typed skills. Orchestrators compose them dynamically based on what the task needs." },
    { icon: Link2, title: "Chain orchestration", body: "Build explicit multi-agent pipelines with conditions, output mapping and branching between steps." },
  ];
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4e8565] bg-[#4e8565]/10 border border-[#4e8565]/20 px-3 py-1.5 rounded-full mb-6">
              A2A Protocol
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">
              Agents that find, delegate and collaborate — on their own
            </h2>
            <p className="text-[#555555] leading-relaxed">
              Greater Agents is built on Google's open Agent-to-Agent protocol. Agents discover other agents at runtime, delegate subtasks to specialists and compose results — without hardcoded pipelines or human orchestration.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {points.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 bg-[#ede3ce] border border-[#cfc4aa] rounded-xl p-4">
                <div className="w-9 h-9 bg-[#4e8565]/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#4e8565]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111] mb-0.5">{title}</p>
                  <p className="text-xs text-[#555555] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Dynamic Agents ────────────────────────────────────────────────────────────
function DynamicAgents() {
  const points = [
    { icon: RefreshCw, title: "Live config polling", body: "Agents check for updated system prompts and tool configs at the start of every run. Change behaviour without restarting the container." },
    { icon: Zap, title: "Dynamic tool scoping", body: "The MCP server returns different tools based on context, environment or permissions. The same agent behaves differently in dev vs production automatically." },
    { icon: Brain, title: "External memory", body: "Agents remember past runs, decisions and learned preferences using vector-backed memory. They improve over time without retraining." },
  ];
  return (
    <section className="py-24 px-8 bg-[#111]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Agents that adapt without redeploying</h2>
        <p className="text-center text-[#888] mb-16 max-w-xl mx-auto">Configuration changes take effect on the next run. No downtime. No rebuilds.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#4e8565]/20 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#4e8565]" />
              </div>
              <p className="font-semibold text-white mb-2">{title}</p>
              <p className="text-sm text-[#888] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Security ──────────────────────────────────────────────────────────────────
function Security() {
  const points = [
    { icon: Lock, title: "Vault / Infisical", body: "LLM API keys, SSH keys, MCP auth tokens and TLS certificates stored as dynamic secrets with automatic rotation and audit logs." },
    { icon: RefreshCw, title: "Nango OAuth", body: "GitHub, Jira, Slack, Linear and 200+ OAuth integrations with automatic token refresh. No manual token management." },
    { icon: Shield, title: "Agent JWT isolation", body: "Every deployed agent container receives a short-lived JWT for authentication. Auto-revoked on stop." },
    { icon: Eye, title: "Zero plaintext secrets", body: "API keys accepted only at registration, immediately written to Vault, never returned in any API response." },
  ];
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">Secrets never touch your database</h2>
          <p className="text-[#555555] max-w-2xl mx-auto leading-relaxed">
            Designed from the ground up for enterprise security. Every secret lives in Vault or Infisical. Every OAuth token lives in Nango. Your PostgreSQL database contains only references — useless without vault access.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 bg-[#ede3ce] border border-[#cfc4aa] rounded-xl p-5">
              <div className="w-9 h-9 bg-[#4e8565]/15 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#4e8565]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111] mb-0.5">{title}</p>
                <p className="text-xs text-[#555555] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── NVIDIA ────────────────────────────────────────────────────────────────────
function Nvidia() {
  const points = [
    { title: "NVIDIA NIM", body: "Optimised local LLM inference. OpenAI-compatible. Data never leaves your infrastructure." },
    { title: "AgentIQ", body: "Per-run profiling. Token cost, tool latency and step analysis. Know exactly where time and money go." },
    { title: "NeMo Guardrails", body: "Programmable safety rails between the agent and the LLM. Essential for regulated industries." },
    { title: "cuVS", body: "GPU-accelerated vector search for agent memory at scale." },
  ];
  return (
    <section className="py-24 px-8 bg-[#111]">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#76b900] bg-[#76b900]/10 border border-[#76b900]/20 px-3 py-1.5 rounded-full mb-6">
              NVIDIA Integration
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Local inference. Enterprise performance.</h2>
            <p className="text-[#888] leading-relaxed">
              Run LLM inference locally on NVIDIA NIM microservices — a single URL change, no code modifications. Profile every agent run with AgentIQ. Enforce safety with NeMo Guardrails. Scale vector search with cuVS.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {points.map(({ title, body }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-[#76b900] mb-1">{title}</p>
                <p className="text-xs text-[#888] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Use Cases ─────────────────────────────────────────────────────────────────
function UseCases() {
  const cases = [
    { icon: GitBranch, title: "DevOps automation", body: "Agents that watch GitHub PRs, update Jira tickets, post Slack summaries and trigger deployments — all on webhooks, no human in the loop." },
    { icon: Database, title: "Data pipeline agents", body: "Scheduled agents that query databases, run dbt models, detect anomalies and post summaries every morning." },
    { icon: Zap, title: "Workflow orchestration", body: "Agents that spin up n8n or Zapier workflows via OpenAPI, monitor progress and retry on failure." },
    { icon: Clock, title: "Support triage", body: "Agents that categorise tickets, create Linear issues, assign teams and draft first responses automatically." },
    { icon: Search, title: "Research agents", body: "Agents that search, summarise and synthesise from multiple sources, storing findings in memory for future runs." },
    { icon: Link2, title: "Agent chains", body: "Multi-agent pipelines where each agent's output becomes the next agent's input — all automated end to end." },
  ];
  return (
    <section id="use-cases" className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111] text-center mb-4">What teams are building</h2>
        <p className="text-center text-[#555555] mb-16">Real workflows running on Greater Agents today.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {cases.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#ede3ce] border border-[#cfc4aa] rounded-2xl p-5 hover:border-[#4e8565] transition-colors">
              <div className="w-9 h-9 bg-[#4e8565]/15 rounded-lg flex items-center justify-center mb-3">
                <Icon size={16} className="text-[#4e8565]" />
              </div>
              <p className="font-semibold text-[#111] mb-1.5 text-sm">{title}</p>
              <p className="text-xs text-[#555555] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Built On ──────────────────────────────────────────────────────────────────
function BuiltOn() {
  const stack = [
    "Google ADK", "LiteLLM", "MCP Protocol", "FastAPI",
    "React + Vite", "PostgreSQL", "Redis", "HashiCorp Vault",
    "Nango", "Docker + SSH", "asyncssh", "Prometheus + Grafana",
  ];
  return (
    <section id="built-on" className="py-24 px-8 bg-[#111]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Open standards. No lock-in.</h2>
        <p className="text-[#888] mb-12">Built entirely on open-source components you already know.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((t) => (
            <span key={t} className="text-sm text-[#ccc] bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">Ready to build your agent farm?</h2>
        <p className="text-[#555555] mb-10 leading-relaxed">
          Start deploying intelligent agents to your own infrastructure today.
        </p>
        <Link to="/signup"
          className="inline-flex items-center gap-2 bg-[#4e8565] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#3d6b52] transition-colors">
          Get Started <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#cfc4aa] py-12 px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <img src="/logo.svg" alt="Greater Agents" className="h-7 w-auto mb-2" />
          <p className="text-xs text-[#9e8e78]">The open enterprise platform for AI agent orchestration.</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#555555]">
          <a href="#platform" className="hover:text-[#111] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#111] transition-colors">How It Works</a>
          <a href="#use-cases" className="hover:text-[#111] transition-colors">Use Cases</a>
          <a href="#" className="hover:text-[#111] transition-colors">Docs</a>
          <a href="https://github.com/mittu-anand/greater-agents-agent-service" target="_blank" rel="noopener"
            className="hover:text-[#111] transition-colors flex items-center gap-1">
            <GithubIcon size={14} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#e3d6bc] font-['Dosis',sans-serif]">
      <Nav />
      <Hero />
      <Problem />
      <Platform />
      <HowItWorks />
      <A2A />
      <DynamicAgents />
      <Security />
      <Nvidia />
      <UseCases />
      <BuiltOn />
      <CTA />
      <Footer />
    </div>
  );
}
