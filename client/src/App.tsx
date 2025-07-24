import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import TaxSavings from "@/pages/tax-savings";
import Chat from "@/pages/chat";
import Navigation from "@/components/Navigation";

function Router() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/upload" component={Upload} />
        <Route path="/tax-savings" component={TaxSavings} />
        <Route path="/chat" component={Chat} />
        <Route component={NotFound} />
      </Switch>
      

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
