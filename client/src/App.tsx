import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Announcements from "@/pages/Announcements";
import Contact from "@/pages/Contact";
import TrackApplication from "@/pages/TrackApplication";
import ComplaintService from "@/pages/ComplaintService";
import BirthCertificateService from "@/pages/BirthCertificateService";
import DeathCertificateService from "@/pages/DeathCertificateService";
import Records from "@/pages/Records";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import BirthCertificatesList from "@/pages/BirthCertificatesList";
import BirthCertificateForm from "@/pages/BirthCertificateForm";
import BirthCertificatePrint from "@/pages/BirthCertificatePrint";
import DeathCertificatesList from "@/pages/DeathCertificatesList";
import DeathCertificateForm from "@/pages/DeathCertificateForm";
import DeathCertificatePrint from "@/pages/DeathCertificatePrint";
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
      <Route path="/records" component={Records} />
      
      {/* Public Service Routes - No Login Required */}
      <Route path="/services/complaint" component={ComplaintService} />
      <Route path="/services/birth-certificate" component={BirthCertificateService} />
      <Route path="/services/death-certificate" component={DeathCertificateService} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/birth-certificates">
        <ProtectedRoute>
          <BirthCertificatesList />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/birth-certificate/new">
        <ProtectedRoute>
          <BirthCertificateForm />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/birth-certificate/:id">
        <ProtectedRoute>
          <BirthCertificateForm />
        </ProtectedRoute>
      </Route>
      <Route path="/birth-certificate/print/:id" component={BirthCertificatePrint} />
      <Route path="/death-certificate/print/:id" component={DeathCertificatePrint} />
      <Route path="/admin/death-certificates">
        <ProtectedRoute>
          <DeathCertificatesList />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/death-certificate/new">
        <ProtectedRoute>
          <DeathCertificateForm />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/death-certificate/:id">
        <ProtectedRoute>
          <DeathCertificateForm />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Router />
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
