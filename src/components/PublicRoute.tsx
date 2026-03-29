import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-(--color-accent)" />
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
