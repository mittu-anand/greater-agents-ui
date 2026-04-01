import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { X, AlertCircle, RefreshCw } from "lucide-react";

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
  children: ReactNode;
}
export function Button({ variant = "primary", size = "md", children, className = "", ...p }: BtnProps) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer";
  const sz   = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const v: Record<string, string> = {
    primary: "bg-(--color-accent) text-white hover:opacity-90",
    ghost:   "text-(--color-text-sub) hover:text-(--color-text)",
    danger:  "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-(--color-border) text-(--color-text) hover:bg-(--color-sidebar-hover)",
  };
  return <button {...p} className={`${base} ${sz} ${v[variant]} ${className}`}>{children}</button>;
}

// ── Input ─────────────────────────────────────────────────────────────────────
type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };
export function Input({ label, error, className = "", ...p }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-(--color-text-sub)">{label}</label>}
      <input
        {...p}
        className={`w-full bg-(--color-bg) border rounded-lg px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "border-(--color-border)"} ${className}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
import type { TextareaHTMLAttributes } from "react";
type TAProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };
export function Textarea({ label, error, className = "", ...p }: TAProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-(--color-text-sub)">{label}</label>}
      <textarea
        {...p}
        className={`w-full bg-(--color-bg) border rounded-lg px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent) resize-none ${error ? "border-red-500" : "border-(--color-border)"} ${className}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
type SelProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };
export function Select({ label, children, className = "", ...p }: SelProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-(--color-text-sub)">{label}</label>}
      <div className="relative">
        <select
          {...p}
          className={`w-full appearance-none bg-(--color-surface) border border-(--color-border) rounded-xl px-3.5 py-2.5 pr-10 text-sm text-(--color-text) font-medium focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:border-(--color-accent) cursor-pointer transition-colors hover:border-(--color-text) ${className}`}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--color-muted)">
          <ChevronDown size={15} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

// ── StyledSelect — inline select without label wrapper ────────────────────────
export function StyledSelect({ className = "", children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative inline-flex">
      <select
        {...p}
        className={`appearance-none bg-(--color-surface) border border-(--color-border) rounded-xl pl-3.5 pr-9 py-2 text-sm text-(--color-text) font-medium focus:outline-none focus:ring-2 focus:ring-(--color-accent) cursor-pointer transition-colors hover:border-(--color-text) ${className}`}
      >
        {children}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-(--color-muted)">
        <ChevronDown size={13} strokeWidth={2.5} />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border) shrink-0">
          <h2 className="font-semibold text-(--color-text)">{title}</h2>
          <button onClick={onClose} className="text-(--color-muted) hover:text-(--color-text) transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────────
export function ConfirmDialog({
  message, detail, confirmLabel = "Confirm", variant = "danger",
  onConfirm, onCancel,
}: {
  message: string;
  detail?: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <p className="font-semibold text-(--color-text) text-base mb-1">{message}</p>
          {detail && <p className="text-sm text-(--color-muted) leading-relaxed">{detail}</p>}
        </div>
        <div className="flex gap-2 px-6 pb-6 justify-end">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const badgeMap: Record<string, string> = {
  running:  "bg-black text-white",
  stopped:  "bg-(--color-border) text-(--color-text-sub)",
  error:    "bg-red-600 text-white",
  pulling:  "bg-(--color-accent) text-white",
  building:  "bg-(--color-accent) text-white",
  starting:  "bg-(--color-accent) text-white",
  verifying: "bg-(--color-accent) text-white",
  pending:  "bg-(--color-border) text-(--color-text-sub)",
  idle:     "bg-(--color-border) text-(--color-text-sub)",
  online:   "bg-black text-white",
  offline:  "bg-red-600 text-white",
  unknown:  "bg-(--color-border) text-(--color-text-sub)",
  success:  "bg-black text-white",
  oauth:    "bg-(--color-accent) text-white",
  static:   "bg-(--color-border) text-(--color-text-sub)",
  mcp:      "bg-black text-white",
  openapi:  "bg-(--color-border) text-(--color-text-sub)",
  function: "bg-(--color-border) text-(--color-text-sub)",
  default:  "bg-(--color-accent) text-white",
};
export function Badge({ label, variant }: { label: string; variant?: string }) {
  const key = variant ?? label.toLowerCase();
  const cls = badgeMap[key] ?? "bg-(--color-border) text-(--color-text-sub)";
  return <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

// ── LoadingSkeleton ───────────────────────────────────────────────────────────
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3 p-8">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-(--color-border) rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// ── ErrorCard ─────────────────────────────────────────────────────────────────
export function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="m-8 p-6 bg-(--color-surface) border border-red-300 rounded-xl flex items-start gap-4">
      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-(--color-text)">Something went wrong</p>
        <p className="text-xs text-(--color-muted) mt-1">{message}</p>
      </div>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RefreshCw size={13} /> Retry</Button>}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
import type { LucideIcon } from "lucide-react";
export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="bg-(--color-border) p-4 rounded-2xl">
        <Icon size={28} className="text-(--color-muted)" />
      </div>
      <div>
        <p className="font-medium text-(--color-text)">{title}</p>
        <p className="text-sm text-(--color-muted) mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}

// ── DeployProgress ────────────────────────────────────────────────────────────
export function DeployProgress({ step, pct }: { step: string; pct: number }) {
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-(--color-muted) mb-1">
        <span>{step}</span><span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-(--color-border) rounded-full overflow-hidden">
        <div className="h-full bg-(--color-accent) transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-0.5 border-b border-(--color-border)">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            active === t
              ? "border-(--color-accent) text-(--color-accent)"
              : "border-transparent text-(--color-muted) hover:text-(--color-text)"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── NavTabs — URL-based tabs using React Router ───────────────────────────────
import { NavLink, useLocation } from "react-router-dom";
export function NavTabs({ tabs }: { tabs: { label: string; to: string }[] }) {
  const { pathname } = useLocation();
  return (
    <div className="flex gap-0.5 border-b border-(--color-border)">
      {tabs.map(({ label, to }) => {
        const active = pathname === to || pathname.startsWith(to + "/");
        return (
          <NavLink
            key={to}
            to={to}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active
                ? "border-(--color-accent) text-(--color-accent)"
                : "border-transparent text-(--color-muted) hover:text-(--color-text)"
            }`}
          >
            {label}
          </NavLink>
        );
      })}
    </div>
  );
}

// ── StatusDot ─────────────────────────────────────────────────────────────────
export function StatusDot({ status }: { status: string }) {
  const c: Record<string, string> = { online: "bg-black", offline: "bg-red-500", running: "bg-black", error: "bg-red-500", unknown: "bg-(--color-muted)" };
  return <span className={`inline-block w-2 h-2 rounded-full ${c[status] ?? "bg-(--color-muted)"}`} />;
}
