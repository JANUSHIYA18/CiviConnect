import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import WelcomeScreen from "./pages/WelcomeScreen";
import LanguageScreen from "./pages/LanguageScreen";
import AuthScreen from "./pages/AuthScreen";
import ServicesScreen from "./pages/ServicesScreen";
import PaymentScreen from "./pages/PaymentScreen";
import ComplaintScreen from "./pages/ComplaintScreen";
import ServiceRequestScreen from "./pages/ServiceRequestScreen";
import StatusTrackingScreen from "./pages/StatusTrackingScreen";
import PresentationScreen from "./pages/PresentationScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/language" element={<LanguageScreen />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/payment/:serviceId" element={<PaymentScreen />} />
              <Route path="/complaint" element={<ComplaintScreen />} />
              <Route path="/service-request" element={<ServiceRequestScreen />} />
              <Route path="/track" element={<StatusTrackingScreen />} />
              <Route path="/presentation" element={<PresentationScreen />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
