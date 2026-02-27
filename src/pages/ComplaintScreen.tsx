import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap, Droplets, Flame, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = [
  { id: "power_cut", label: "Power Cut / Outage", icon: Zap, color: "bg-electricity/15 text-electricity" },
  { id: "water_leakage", label: "Water Leakage", icon: Droplets, color: "bg-accent/15 text-accent" },
  { id: "gas_issue", label: "Gas Supply Issue", icon: Flame, color: "bg-gas/15 text-gas" },
  { id: "waste_issue", label: "Waste Collection", icon: Trash2, color: "bg-municipal/15 text-municipal" },
];

const ComplaintScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"category" | "details" | "submitting" | "done">("category");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [complaintRef, setComplaintRef] = useState("");

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setStep("submitting");

    // Demo mode: simulate complaint submission
    const ref = "CMP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTimeout(() => {
      setComplaintRef(ref);
      setStep("done");
      toast.success("Complaint registered successfully!");
    }, 1500);
  };

  return (
    <KioskLayout title="File Complaint" subtitle="Report an Issue">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {step === "category" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-destructive/10 mx-auto">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">Select Category</h2>
              <p className="text-muted-foreground text-center mb-6">What type of issue are you facing?</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setCategory(cat.id); setStep("details"); }}
                    className="flex flex-col items-center gap-2 rounded-xl bg-background p-5 border border-border hover:border-primary transition-colors touch-target"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${cat.color}`}>
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground text-center">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">Describe Issue</h2>
              <p className="text-muted-foreground text-center mb-6">
                Category: <span className="font-medium text-foreground">{categories.find(c => c.id === category)?.label}</span>
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject (e.g., No power since morning)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl"
                />
                <div className="flex gap-3">
                  <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("category")}>
                    Back
                  </Button>
                  <Button variant="kiosk" className="flex-1 h-14" onClick={handleSubmit} disabled={!subject.trim() || !description.trim()}>
                    Submit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "submitting" && (
            <div className="rounded-2xl bg-card p-12 kiosk-card-shadow text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-muted border-t-secondary"
              />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Registering Complaint</h2>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <CheckCircle2 className="h-20 w-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Complaint Registered!</h2>
              <p className="text-muted-foreground mb-1">Reference ID:</p>
              <p className="text-xl font-bold text-primary mb-4 font-mono">{complaintRef}</p>
              <p className="text-sm text-muted-foreground mb-6">Save this ID to track your complaint status</p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>
                  More Services
                </Button>
                <Button variant="kiosk" className="flex-1 h-14" onClick={() => navigate("/")}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default ComplaintScreen;
