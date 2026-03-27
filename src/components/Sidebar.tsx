import { NavLink } from "react-router-dom";
import { LayoutDashboard, Bot, Cpu, Server, FileCode, Sparkles, Tractor, Wrench, Key, ChevronRight } from "lucide-react";
import { useSidebarStore } from "../store/useSidebarStore";

const LIBRARY = [
  { to: "/agents",       label: "Agents",       icon: Bot },
  { to: "/llms",         label: "LLMs",         icon: Cpu },
  { to: "/mcp-servers",  label: "MCP Servers",  icon: Server },
  { to: "/openapi-specs",label: "OpenAPI Specs", icon: FileCode },
  { to: "/skills",       label: "Agent Skills", icon: Sparkles },
];

const FARMS = [
  { to: "/farms",        label: "Farms",        icon: Tractor },
];

const TOOLING = [
  { to: "/tools",        label: "Tool Registry",icon: Wrench },
  { to: "/credentials",  label: "Credentials",  icon: Key },
];

function NavGroup({ label, links, expanded }: { label: string; links: typeof LIBRARY; expanded: boolean }) {
  return (
    <div className="mb-2">
      {expanded && <p className="text-[10px] font-semibold uppercase tracking-widest text-(--color-muted) px-3 mb-1">{label}</p>}
      {links.map(({ to, label: lbl, icon: Icon }) => (
        <NavLink key={to} to={to} title={!expanded ? lbl : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-lg transition-colors mb-0.5 ${expanded ? "gap-3 px-3 py-2" : "justify-center p-2.5"}
             ${isActive ? "bg-(--color-accent) text-white" : "text-(--color-text-sub) hover:bg-(--color-sidebar-hover) hover:text-(--color-text)"}`}>
          <Icon size={16} className="shrink-0" />
          {expanded && <span className="text-sm truncate">{lbl}</span>}
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { expanded, toggle } = useSidebarStore();
  return (
    <aside className={`relative flex flex-col shrink-0 h-screen sticky top-0 bg-(--color-sidebar) border-r border-(--color-border) transition-all duration-200 ease-in-out ${expanded ? "w-52" : "w-14"}`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-14 px-2 border-b border-(--color-border) overflow-hidden">
        <NavLink to="/" title="Dashboard">
          <img src="/logo.svg" alt="Greater Agents" className={`object-contain shrink-0 transition-all duration-200 ${expanded ? "h-9 w-36" : "h-8 w-auto"}`} />
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 p-2 pt-3 overflow-y-auto">
        {/* Dashboard */}
        <NavLink to="/" end title={!expanded ? "Dashboard" : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-lg transition-colors mb-2 ${expanded ? "gap-3 px-3 py-2" : "justify-center p-2.5"}
             ${isActive ? "bg-(--color-accent) text-white" : "text-(--color-text-sub) hover:bg-(--color-sidebar-hover) hover:text-(--color-text)"}`}>
          <LayoutDashboard size={16} className="shrink-0" />
          {expanded && <span className="text-sm truncate">Dashboard</span>}
        </NavLink>

        {expanded && <div className="h-px bg-(--color-border) mb-2" />}
        <NavGroup label="Farms" links={FARMS} expanded={expanded} />
        {expanded && <div className="h-px bg-(--color-border) mb-2" />}
        <NavGroup label="Library" links={LIBRARY} expanded={expanded} />
        {expanded && <div className="h-px bg-(--color-border) mb-2" />}
        <NavGroup label="Tooling" links={TOOLING} expanded={expanded} />
      </nav>

      {/* Toggle */}
      <div className="p-2 border-t border-(--color-border)">
        <button onClick={toggle} title={expanded ? "Collapse" : "Expand"}
          className={`flex items-center w-full rounded-lg p-2.5 transition-colors text-(--color-muted) hover:bg-(--color-sidebar-hover) hover:text-(--color-text) ${expanded ? "gap-3" : "justify-center"}`}>
          <ChevronRight size={15} className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          {expanded && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
