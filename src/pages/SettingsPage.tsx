import { useState, useEffect } from "react";
import { useToastStore } from "../store/useToastStore";
import { Button, Input } from "../components/ui";
import { Shield, Database, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

const BACKEND = import.meta.env.VITE_API_URL ?? "";

interface CredServiceHealth {
  status: string;
  provider: string;
  backend?: { status: string; provider: string };
}

export default function SettingsPage() {
  const toast = useToastStore((s) => s.push);
  const [health, setHealth] = useState<CredServiceHealth | null>(null);
  const [checking, setChecking] = useState(false);
  const [provider, setProvider] = useState<"database" | "infisical">("database");
  const [infisicalUrl, setInfisicalUrl] = useState("http://localhost:8888");
  const [credServiceUrl, setCredServiceUrl] = useState("http://localhost:8002");

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${credServiceUrl}/health`);
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ status: "error", provider: "unknown" });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkHealth(); }, []);

  return (
    <div className="p-8 w-full max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-(--color-text)">Settings</h1>
        <p className="text-sm text-(--color-muted) mt-0.5">Platform configuration</p>
      </div>

      {/* Credential Service */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-(--color-border) rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-(--color-text-sub)" />
          </div>
          <div>
            <p className="font-semibold text-(--color-text)">Credential Service</p>
            <p className="text-xs text-(--color-muted)">Where secrets (SSH keys, API keys) are stored</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {checking && <Loader2 size={14} className="animate-spin text-(--color-muted)" />}
            {!checking && health && (
              health.status === "ok"
                ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={13} /> Connected</span>
                : <span className="flex items-center gap-1 text-xs text-red-500"><XCircle size={13} /> Unreachable</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Credential Service URL"
            value={credServiceUrl}
            onChange={(e) => setCredServiceUrl(e.target.value)}
            placeholder="http://localhost:8002"
          />

          {health && (
            <div className={`px-4 py-3 rounded-xl text-sm ${health.status === "ok" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className={`font-medium ${health.status === "ok" ? "text-green-700" : "text-red-600"}`}>
                {health.status === "ok" ? `Connected — using ${health.provider} provider` : "Credential service not reachable"}
              </p>
              {health.status !== "ok" && (
                <p className="text-xs text-red-500 mt-1">
                  Start it: <code className="bg-red-100 px-1 rounded">cd greater-agents-credential-service && python main.py</code>
                </p>
              )}
              {health.status === "ok" && health.backend && (
                <p className="text-xs text-green-600 mt-0.5">Backend: {health.backend.provider}</p>
              )}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={checkHealth} disabled={checking} className="w-fit">
            {checking ? <><Loader2 size={13} className="animate-spin" /> Checking…</> : "Check Connection"}
          </Button>
        </div>
      </div>

      {/* Provider selection info */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-6">
        <p className="font-semibold text-(--color-text) mb-4">Credential Provider</p>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border-2 transition-colors ${provider === "database" ? "border-(--color-accent) bg-(--color-accent)/5" : "border-(--color-border)"}`}
            onClick={() => setProvider("database")} role="button">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className="text-(--color-accent)" />
              <p className="font-semibold text-sm text-(--color-text)">Database</p>
              {provider === "database" && <span className="ml-auto text-xs text-(--color-accent) font-medium">Active</span>}
            </div>
            <p className="text-xs text-(--color-muted) leading-relaxed">
              Secrets encrypted with Fernet and stored locally. No external dependencies. Good for development and small teams.
            </p>
          </div>
          <div className={`p-4 rounded-xl border-2 transition-colors ${provider === "infisical" ? "border-(--color-accent) bg-(--color-accent)/5" : "border-(--color-border)"}`}
            onClick={() => setProvider("infisical")} role="button">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-(--color-accent)" />
              <p className="font-semibold text-sm text-(--color-text)">Infisical</p>
              {provider === "infisical" && <span className="ml-auto text-xs text-(--color-accent) font-medium">Active</span>}
            </div>
            <p className="text-xs text-(--color-muted) leading-relaxed">
              Self-hosted Infisical instance. Audit logs, secret rotation, fine-grained access control.
            </p>
          </div>
        </div>

        {provider === "infisical" && (
          <div className="mt-4 p-4 bg-(--color-bg) border border-(--color-border) rounded-xl flex flex-col gap-3">
            <Input label="Infisical URL" value={infisicalUrl} onChange={(e) => setInfisicalUrl(e.target.value)} placeholder="http://localhost:8888" />
            <p className="text-xs text-(--color-muted)">
              Set <code className="bg-(--color-border) px-1 rounded">CREDENTIAL_PROVIDER=infisical</code> in the credential service <code className="bg-(--color-border) px-1 rounded">.env</code> and restart it.
              {" "}<a href="https://infisical.com/docs/self-hosting/overview" target="_blank" rel="noopener" className="text-(--color-accent) hover:underline inline-flex items-center gap-0.5">Infisical docs <ExternalLink size={10} /></a>
            </p>
          </div>
        )}

        <p className="text-xs text-(--color-muted) mt-4">
          To switch providers, update <code className="bg-(--color-border) px-1 rounded">CREDENTIAL_PROVIDER</code> in <code className="bg-(--color-border) px-1 rounded">greater-agents-credential-service/.env</code> and restart the service.
        </p>
      </div>
    </div>
  );
}
