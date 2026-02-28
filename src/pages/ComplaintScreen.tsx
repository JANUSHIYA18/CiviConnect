import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap, Droplets, Flame, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ComplaintScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<"category" | "details" | "submitting" | "done">("category");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [complaintRef, setComplaintRef] = useState("");

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const categories = [
    { id: "power_cut", label: t("category_power_cut"), icon: Zap, color: "bg-electricity/15 text-electricity" },
    { id: "water_leakage", label: t("category_water_leakage"), icon: Droplets, color: "bg-accent/15 text-accent" },
    { id: "gas_issue", label: t("category_gas_issue"), icon: Flame, color: "bg-gas/15 text-gas" },
    { id: "waste_issue", label: t("category_waste_issue"), icon: Trash2, color: "bg-municipal/15 text-municipal" },
  ];

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error(t("fill_all_fields"));
      return;
    }
    setStep("submitting");

    try {
      const data = await apiRequest<{ complaintRef: string }>("/complaints", {
        method: "POST",
        body: {
          serviceType: "municipal",
          category,
          subject,
          description,
        },
      });
      setComplaintRef(data.complaintRef);
      setStep("done");
      toast.success(t("complaint_success"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("complaint_failed"));
      setStep("details");
    }
  };

  return (
    <KioskLayout title={t("file_complaint")} subtitle={t("report_issue")} showLogout>
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
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("select_category")}</h2>
              <p className="text-muted-foreground text-center mb-6">{t("issue_question")}</p>
              <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground">
                {t("complaint_help_category")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setCategory(cat.id);
                      setStep("details");
                    }}
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
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("describe_issue")}</h2>
              <p className="text-muted-foreground text-center mb-6">
                {t("category_label")} <span className="font-medium text-foreground">{categories.find((c) => c.id === category)?.label}</span>
              </p>
              <p className="mb-4 text-xs text-muted-foreground">{t("complaint_help_details")}</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t("subject_placeholder")}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Textarea
                  placeholder={t("issue_detail_placeholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl"
                />
                <div className="flex gap-3">
                  <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("category")}>
                    {t("back")}
                  </Button>
                  <Button variant="kiosk" className="flex-1 h-14" onClick={handleSubmit} disabled={!subject.trim() || !description.trim()}>
                    {t("submit")}
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
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("registering_complaint")}</h2>
              <p className="text-muted-foreground">{t("please_wait")}</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <CheckCircle2 className="h-20 w-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("complaint_registered")}</h2>
              <p className="text-muted-foreground mb-1">{t("reference_id")}</p>
              <p className="text-xl font-bold text-primary mb-4 font-mono">{complaintRef}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("save_ref_to_track")}</p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>
                  {t("more_services")}
                </Button>
                <Button variant="kiosk" className="flex-1 h-14" onClick={() => navigate("/")}>
                  {t("done")}
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
