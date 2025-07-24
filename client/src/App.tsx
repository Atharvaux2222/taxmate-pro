import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import TaxSavings from "@/pages/tax-savings";
import Chat from "@/pages/chat";
import Navigation from "@/components/Navigation";
import FloatingChat from "@/components/FloatingChat";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/upload" component={Upload} />
            <Route path="/tax-savings" component={TaxSavings} />
            <Route path="/chat" component={Chat} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      
      {isAuthenticated && <FloatingChat />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
