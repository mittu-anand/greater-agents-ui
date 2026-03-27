import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const titles: Record<string, string> = {
  "/":              "Dashboard",
  "/agents":        "Agent Library",
  "/llms":          "LLM Library",
  "/mcp-servers":   "MCP Servers",
  "/openapi-specs": "OpenAPI Specs",
  "/skills":        "Agent Skills",
  "/farms":         "Farms",
  "/tools":         "Tool Registry",
  "/credentials":   "Credentials",
};

export default function Header() {
  const { pathname } = useLocation();
  const base = "/" + pathname.split("/")[1];
  const title = titles[base] ?? "Greater Agents";
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-(--color-text) tracking-tight">{title}</h1>
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 text-(--color-muted) hover:text-(--color-text) bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5 text-xs transition-colors">
          <Search size={13} /><span>Search</span>
          <kbd className="ml-1 text-[10px] bg-(--color-border) px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
        <button className="p-2 rounded-lg text-(--color-muted) hover:bg-(--color-bg) hover:text-(--color-text) transition-colors"><Bell size={15} /></button>
        <div className="w-7 h-7 rounded-full bg-(--color-accent) flex items-center justify-center text-white text-xs font-semibold ml-1">G</div>
      </div>
    </header>
  );
}
