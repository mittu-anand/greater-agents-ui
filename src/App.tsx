import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
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

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <div className="flex h-screen bg-(--color-bg) overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/"                              element={<DashboardPage />} />
                <Route path="/agents"                        element={<AgentLibraryPage />} />
                <Route path="/agents/new"                    element={<AgentWizardPage />} />
                <Route path="/agents/:agentId"               element={<AgentDetailPage />} />
                <Route path="/llms"                          element={<LLMLibraryPage />} />
                <Route path="/mcp-servers"                   element={<McpServersPage />} />
                <Route path="/openapi-specs"                 element={<OpenApiSpecsPage />} />
                <Route path="/skills"                        element={<AgentSkillsPage />} />
                <Route path="/farms"                         element={<FarmsPage />} />
                <Route path="/farms/:farmId"                 element={<FarmDetailPage />} />
                <Route path="/tools"                         element={<ToolRegistryPage />} />
                <Route path="*"                              element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
