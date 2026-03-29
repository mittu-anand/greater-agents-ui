import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const titles: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/agents":        "Agent Library",
  "/llms":          "LLM Library",
  "/mcp-servers":   "MCP Servers",
  "/openapi-specs": "OpenAPI Specs",
  "/skills":        "Agent Skills",
  "/farms":         "Farms",
  "/tools":         "Tool Registry",
};

export default function Header() {
  const { pathname } = useLocation();
  const base = "/" + pathname.split("/")[1];
  const title = titles[base] ?? "Greater Agents";
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "G";

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-(--color-text) tracking-tight">{title}</h1>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-(--color-muted) hover:bg-(--color-bg) hover:text-(--color-text) transition-colors">
          <Bell size={15} />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg hover:bg-(--color-bg) px-2 py-1 transition-colors"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-(--color-accent) flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
            )}
            {user?.name && (
              <span className="text-xs text-(--color-text) hidden sm:block max-w-24 truncate">{user.name}</span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-lg py-1 z-50">
              {user && (
                <div className="px-4 py-2 border-b border-(--color-border)">
                  <p className="text-xs font-semibold text-(--color-text) truncate">{user.name}</p>
                  <p className="text-xs text-(--color-muted) truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
              >
                <LogOut size={14} className="text-(--color-muted)" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
