import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, ArrowRight, Zap, MapPin, Gauge, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";

const requestTypes = [
  { id: "new_connection", label: "New Connection", icon: Zap, color: "bg-electricity/15 text-electricity" },
  { id: "address_change", label: "Address Change", icon: MapPin, color: "bg-accent/15 text-accent" },
  { id: "meter_replace", label: "Meter Replacement", icon: Gauge, color: "bg-gas/15 text-gas" },
  { id: "name_correction", label: "Name Correction", icon: User, color: "bg-primary/10 text-primary" },
];

const ServiceRequestScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"type" | "details" | "submitting" | "done">("type");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [requestRef, setRequestRef] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setStep("submitting");
    const ref = "SR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTimeout(() => {
      setRequestRef(ref);
      setStep("done");
      toast.success("Service request submitted!");
    }, 1500);
  };

  return (
    <KioskLayout title="Service Request" subtitle="New Request">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          {step === "type" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">Select Request Type</h2>
              <p className="text-muted-foreground text-center mb-6">What service do you need?</p>
              <div className="grid grid-cols-2 gap-3">
                {requestTypes.map((rt) => (
                  <motion.button
                    key={rt.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setRequestType(rt.id); setStep("details"); }}
                    className="flex flex-col items-center gap-2 rounded-xl bg-background p-5 border border-border hover:border-primary transition-colors touch-target"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${rt.color}`}>
                      <rt.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground text-center">{rt.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">Request Details</h2>
              <p className="text-muted-foreground text-center mb-6">
                Type: <span className="font-medium text-foreground">{requestTypes.find(r => r.id === requestType)?.label}</span>
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Textarea
                  placeholder="Provide details about your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Documents can be submitted at the service counter with your reference ID.</p>
                <div className="flex gap-3">
                  <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("type")}>Back</Button>
                  <Button variant="kiosk" className="flex-1 h-14" onClick={handleSubmit} disabled={!name.trim() || !description.trim()}>
                    Submit <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "submitting" && (
            <div className="rounded-2xl bg-card p-12 kiosk-card-shadow text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-muted border-t-secondary" />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Submitting Request</h2>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <CheckCircle2 className="h-20 w-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Request Submitted!</h2>
              <p className="text-muted-foreground mb-1">Reference ID:</p>
              <p className="text-xl font-bold text-primary mb-4 font-mono">{requestRef}</p>
              <p className="text-sm text-muted-foreground mb-6">Use this ID to track your request status</p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>More Services</Button>
                <Button variant="kiosk" className="flex-1 h-14" onClick={() => navigate("/")}>Done</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default ServiceRequestScreen;
