import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame, Building2, Droplets, Trash2, FileText, AlertTriangle, ClipboardList, Search } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

const services = [
  { id: "electricity", title: "Electricity", description: "Pay bills, report outages", icon: Zap, color: "bg-electricity/15 text-electricity", route: "/payment/electricity" },
  { id: "gas", title: "Gas", description: "Pipeline gas, cylinder booking", icon: Flame, color: "bg-gas/15 text-gas", route: "/payment/gas" },
  { id: "water", title: "Water Supply", description: "Water bills, connection", icon: Droplets, color: "bg-accent/15 text-accent", route: "/payment/water" },
  { id: "waste", title: "Waste Mgmt", description: "Collection, complaints", icon: Trash2, color: "bg-municipal/15 text-municipal", route: "/payment/waste" },
  { id: "property", title: "Property Tax", description: "Payments, assessments", icon: Building2, color: "bg-primary/10 text-primary", route: "/payment/property" },
  { id: "certificates", title: "Certificates", description: "Birth, death, domicile", icon: FileText, color: "bg-secondary/20 text-secondary-foreground", route: "/payment/certificates" },
  { id: "complaint", title: "File Complaint", description: "Report an issue", icon: AlertTriangle, color: "bg-destructive/10 text-destructive", route: "/complaint" },
  { id: "service-request", title: "Service Request", description: "New connection, changes", icon: ClipboardList, color: "bg-accent/15 text-accent", route: "/service-request" },
  { id: "track", title: "Track Status", description: "Check complaint/request", icon: Search, color: "bg-primary/10 text-primary", route: "/track" },
];

const ServicesScreen = () => {
  const navigate = useNavigate();
  const { showWarning, secondsLeft, resetTimer } = useSessionTimeout();

  return (
    <KioskLayout title="Select Service" subtitle="Step 3 of 5">
      <div className="flex flex-1 flex-col items-center px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">What can we help you with?</h2>
          <p className="text-muted-foreground mt-1">Select a service to continue</p>
        </motion.div>

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
