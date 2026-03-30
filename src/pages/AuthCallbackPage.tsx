import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      setToken(token);
      // Small delay to let zustand persist write to localStorage before navigation
      setTimeout(() => navigate("/dashboard", { replace: true }), 100);
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-(--color-accent)" />
        <p className="text-sm text-(--color-muted)">Signing you in…</p>
      </div>
    </div>
  );
}
