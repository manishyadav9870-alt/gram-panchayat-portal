import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Announcements from "@/pages/Announcements";
import Contact from "@/pages/Contact";
import TrackApplication from "@/pages/TrackApplication";
import ComplaintService from "@/pages/ComplaintService";
import BirthCertificateService from "@/pages/BirthCertificateService";
import DeathCertificateService from "@/pages/DeathCertificateService";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/contact" component={Contact} />
      <Route path="/track" component={TrackApplication} />
      <Route path="/services/complaint" component={ComplaintService} />
      <Route path="/services/birth-certificate" component={BirthCertificateService} />
      <Route path="/services/death-certificate" component={DeathCertificateService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
