import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Plan from "./pages/app/Plan";

import Library from "./pages/app/Library";
import LibraryDetail from "./pages/app/LibraryDetail";
import Support from "./pages/app/Support";
import Talk from "./pages/app/Talk";
import Journal from "./pages/app/Journal";
import Readiness from "./pages/app/Readiness";
import Identity from "./pages/app/Identity";
import Community from "./pages/app/Community";
import Resources from "./pages/app/Resources";
import AppearancePage from "./pages/app/Appearance";
import { AdagioProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import RequireAuth from "./components/app/RequireAuth";
import Auth from "./pages/Auth";
import Feedback from "./pages/app/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdagioProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plan" element={<Plan />} />
              
              <Route path="/library" element={<Library />} />
              <Route path="/library/:slug" element={<LibraryDetail />} />
              <Route path="/support" element={<Support />} />
              <Route path="/talk" element={<Talk />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/readiness" element={<Readiness />} />
              <Route path="/identity" element={<Identity />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/appearance" element={<AppearancePage />} />
              <Route path="/feedback" element={<Feedback />} />
            </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AdagioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
