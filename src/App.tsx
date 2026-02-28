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
import PaymentReturnScreen from "./pages/PaymentReturnScreen";
import ProfileScreen from "./pages/ProfileScreen";
import PendingBillsScreen from "./pages/PendingBillsScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import RemindersScreen from "./pages/RemindersScreen";
import SettingsScreen from "./pages/SettingsScreen";
import HelpScreen from "./pages/HelpScreen";
import DownloadsScreen from "./pages/DownloadsScreen";
import PaymentDetailsScreen from "./pages/PaymentDetailsScreen";
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
              <Route path="/payment/success" element={<PaymentReturnScreen mode="success" />} />
              <Route path="/payment/cancel" element={<PaymentReturnScreen mode="cancel" />} />
              <Route path="/complaint" element={<ComplaintScreen />} />
              <Route path="/service-request" element={<ServiceRequestScreen />} />
              <Route path="/track" element={<StatusTrackingScreen />} />
              <Route path="/presentation" element={<PresentationScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/pending-bills" element={<PendingBillsScreen />} />
              <Route path="/profile/notifications" element={<NotificationsScreen />} />
              <Route path="/profile/reminders" element={<RemindersScreen />} />
              <Route path="/profile/settings" element={<SettingsScreen />} />
              <Route path="/profile/help" element={<HelpScreen />} />
              <Route path="/profile/downloads" element={<DownloadsScreen />} />
              <Route path="/payment/details/:transactionRef" element={<PaymentDetailsScreen />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
