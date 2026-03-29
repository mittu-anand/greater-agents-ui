import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, _hasHydrated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after store has hydrated from localStorage
    if (_hasHydrated && !token) {
      navigate("/login", { replace: true });
    }
  }, [_hasHydrated, token]);

  // Show spinner while store is hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-(--color-accent)" />
      </div>
    );
  }

  if (!token) return null;

  return <>{children}</>;
}
