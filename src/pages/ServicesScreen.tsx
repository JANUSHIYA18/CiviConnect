import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame, Building2, Droplets, Trash2, FileText } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";

const services = [
  {
    id: "electricity",
    title: "Electricity",
    description: "Pay bills, report outages, new connection",
    icon: Zap,
    color: "bg-electricity/15 text-electricity",
    iconColor: "text-electricity",
  },
  {
    id: "gas",
    title: "Gas",
    description: "Pipeline gas, cylinder booking, complaints",
    icon: Flame,
    color: "bg-gas/15 text-gas",
    iconColor: "text-gas",
  },
  {
    id: "water",
    title: "Water Supply",
    description: "Water bills, connection, quality reports",
    icon: Droplets,
    color: "bg-accent/15 text-accent",
    iconColor: "text-accent",
  },
  {
    id: "waste",
    title: "Waste Management",
    description: "Collection schedule, complaints, recycling",
    icon: Trash2,
    color: "bg-municipal/15 text-municipal",
    iconColor: "text-municipal",
  },
  {
    id: "property",
    title: "Property Tax",
    description: "Tax payments, assessments, certificates",
    icon: Building2,
    color: "bg-primary/10 text-primary",
    iconColor: "text-primary",
  },
  {
    id: "certificates",
    title: "Certificates",
    description: "Birth, death, domicile certificates",
    icon: FileText,
    color: "bg-secondary/20 text-secondary-foreground",
    iconColor: "text-secondary",
  },
];

const ServicesScreen = () => {
  const navigate = useNavigate();

  return (
    <KioskLayout title="Select Service" subtitle="Step 3 of 5">
      <div className="flex flex-1 flex-col items-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground">What can we help you with?</h2>
          <p className="text-muted-foreground mt-1">Select a service to continue</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {services.map((service, i) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/payment/${service.id}`)}
              className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 kiosk-card-shadow hover:kiosk-card-shadow-hover transition-shadow cursor-pointer touch-target text-center"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${service.color}`}>
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-card-foreground">{service.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
};

export default ServicesScreen;
