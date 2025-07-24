import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import TaxSavings from "@/pages/tax-savings";
import Chat from "@/pages/chat";
import Navigation from "@/components/Navigation";
import FloatingChat from "@/components/FloatingChat";

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <Switch>
        <ProtectedRoute path="/" component={Dashboard} />
        <ProtectedRoute path="/upload" component={Upload} />
        <ProtectedRoute path="/tax-savings" component={TaxSavings} />
        <ProtectedRoute path="/chat" component={Chat} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      
      {user && <FloatingChat />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
