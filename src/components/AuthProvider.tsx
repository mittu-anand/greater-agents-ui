// Auth is handled via JWT stored in localStorage (useAuthStore).
// This component is a passthrough — kept for future Keycloak re-integration.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
