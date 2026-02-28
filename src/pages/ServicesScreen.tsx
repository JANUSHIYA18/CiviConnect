import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Flame, Building2, Droplets, Trash2, FileText, AlertTriangle, ClipboardList, Search } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showWarning, secondsLeft, resetTimer } = useSessionTimeout();

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const services = [
    { id: "electricity", title: t("service_electricity"), description: t("service_electricity_desc"), icon: Zap, color: "bg-electricity/15 text-electricity", route: "/payment/electricity" },
    { id: "gas", title: t("service_gas"), description: t("service_gas_desc"), icon: Flame, color: "bg-gas/15 text-gas", route: "/payment/gas" },
    { id: "water", title: t("service_water"), description: t("service_water_desc"), icon: Droplets, color: "bg-accent/15 text-accent", route: "/payment/water" },
    { id: "waste", title: t("service_waste"), description: t("service_waste_desc"), icon: Trash2, color: "bg-municipal/15 text-municipal", route: "/payment/waste" },
    { id: "property", title: t("service_property"), description: t("service_property_desc"), icon: Building2, color: "bg-primary/10 text-primary", route: "/payment/property" },
    { id: "certificates", title: t("service_certificates"), description: t("service_certificates_desc"), icon: FileText, color: "bg-secondary/20 text-secondary-foreground", route: "/payment/certificates" },
    { id: "complaint", title: t("file_complaint"), description: t("file_complaint_desc"), icon: AlertTriangle, color: "bg-destructive/10 text-destructive", route: "/complaint" },
    { id: "service-request", title: t("service_request"), description: t("service_request_desc"), icon: ClipboardList, color: "bg-accent/15 text-accent", route: "/service-request" },
    { id: "track", title: t("track_status"), description: t("track_status_desc"), icon: Search, color: "bg-primary/10 text-primary", route: "/track" },
  ];

  return (
    <KioskLayout title={t("select_service_title")} subtitle={t("step_3_of_5")} showLogout>
      <div className="flex flex-1 flex-col items-center px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">{t("services_heading")}</h2>
          <p className="text-muted-foreground mt-1">{t("services_subheading")}</p>
        </motion.div>

        <div className="mb-6 w-full max-w-3xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          <p className="font-semibold">{t("services_help_title")}</p>
          <p className="mt-1 text-muted-foreground">{t("services_help_body")}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
          {services.map((service, i) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(service.route)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-5 kiosk-card-shadow hover:kiosk-card-shadow-hover transition-shadow cursor-pointer touch-target text-center"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${service.color}`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-card-foreground">{service.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
      <SessionTimeoutWarning show={showWarning} secondsLeft={secondsLeft} onContinue={resetTimer} />
    </KioskLayout>
  );
};

export default ServicesScreen;
