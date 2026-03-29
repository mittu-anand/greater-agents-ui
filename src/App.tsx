import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider      from "./components/AuthProvider";
import ProtectedRoute    from "./components/ProtectedRoute";
import PublicRoute       from "./components/PublicRoute";
import Sidebar           from "./components/Sidebar";
import Header            from "./components/Header";
import LandingPage       from "./pages/LandingPage";
import LoginPage         from "./pages/LoginPage";
import SignupPage        from "./pages/SignupPage";
import AuthCallbackPage  from "./pages/AuthCallbackPage";
import DashboardPage     from "./pages/DashboardPage";
import AgentLibraryPage  from "./pages/AgentLibraryPage";
import AgentWizardPage   from "./pages/AgentWizardPage";
import AgentDetailPage   from "./pages/AgentDetailPage";
import LLMLibraryPage    from "./pages/LLMLibraryPage";
import McpServersPage    from "./pages/McpServersPage";
import OpenApiSpecsPage  from "./pages/OpenApiSpecsPage";
import AgentSkillsPage   from "./pages/AgentSkillsPage";
import FarmsPage         from "./pages/FarmsPage";
import FarmDetailPage    from "./pages/FarmDetailPage";
import ToolRegistryPage  from "./pages/ToolRegistryPage";
import NotFound          from "./pages/NotFound";
import Toaster           from "./components/Toaster";

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-(--color-bg) overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public — redirect to /dashboard if already logged in */}
            <Route path="/"       element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            {/* Auth callback — always public */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected app routes */}
            <Route path="/dashboard"       element={<AppShell><DashboardPage /></AppShell>} />
            <Route path="/agents"          element={<AppShell><AgentLibraryPage /></AppShell>} />
            <Route path="/agents/new"      element={<AppShell><AgentWizardPage /></AppShell>} />
            <Route path="/agents/:agentId/*" element={<AppShell><AgentDetailPage /></AppShell>} />
            <Route path="/llms"            element={<AppShell><LLMLibraryPage /></AppShell>} />
            <Route path="/mcp-servers"     element={<AppShell><McpServersPage /></AppShell>} />
            <Route path="/openapi-specs"   element={<AppShell><OpenApiSpecsPage /></AppShell>} />
            <Route path="/skills"          element={<AppShell><AgentSkillsPage /></AppShell>} />
            <Route path="/farms"           element={<AppShell><FarmsPage /></AppShell>} />
            <Route path="/farms/:farmId"   element={<AppShell><FarmDetailPage /></AppShell>} />
            <Route path="/tools"           element={<AppShell><ToolRegistryPage /></AppShell>} />
            <Route path="*"                element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
