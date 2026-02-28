import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, ArrowRight, Zap, MapPin, Gauge, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceRequestScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<"type" | "details" | "submitting" | "done">("type");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [requestRef, setRequestRef] = useState("");
  const [documents, setDocuments] = useState<FileList | null>(null);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const requestTypes = [
    { id: "new_connection", label: t("req_new_connection"), icon: Zap, color: "bg-electricity/15 text-electricity" },
    { id: "address_change", label: t("req_address_change"), icon: MapPin, color: "bg-accent/15 text-accent" },
    { id: "meter_replace", label: t("req_meter_replace"), icon: Gauge, color: "bg-gas/15 text-gas" },
    { id: "name_correction", label: t("req_name_correction"), icon: User, color: "bg-primary/10 text-primary" },
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error(t("fill_all_fields"));
      return;
    }
    setStep("submitting");
    try {
      const formData = new FormData();
      formData.append("requestType", requestType);
      formData.append("serviceCategory", "electricity");
      formData.append("fullName", name);
      formData.append("description", description);
      Array.from(documents || []).forEach((doc) => formData.append("documents", doc));
      const data = await apiRequest<{ requestRef: string }>("/service-requests", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      setRequestRef(data.requestRef);
      setStep("done");
      toast.success(t("request_success"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("request_failed"));
      setStep("details");
    }
  };

  return (
    <KioskLayout title={t("service_request")} subtitle={t("request_new")} showLogout>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          {step === "type" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("select_request_type")}</h2>
              <p className="text-muted-foreground text-center mb-6">{t("service_need_question")}</p>
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                {t("request_help_type")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {requestTypes.map((rt) => (
                  <motion.button
                    key={rt.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setRequestType(rt.id);
                      setStep("details");
                    }}
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
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("request_details")}</h2>
              <p className="text-muted-foreground text-center mb-6">
                {t("type_label")} <span className="font-medium text-foreground">{requestTypes.find((r) => r.id === requestType)?.label}</span>
              </p>
              <p className="mb-4 text-xs text-muted-foreground">{t("request_help_details")}</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t("full_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Textarea
                  placeholder={t("request_detail_placeholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl"
                />
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments(e.target.files)}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
                />
                <p className="text-xs text-muted-foreground">{t("upload_docs_help")}</p>
                <div className="flex gap-3">
                  <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("type")}>
                    {t("back")}
                  </Button>
                  <Button variant="kiosk" className="flex-1 h-14" onClick={handleSubmit} disabled={!name.trim() || !description.trim()}>
                    {t("submit")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "submitting" && (
            <div className="rounded-2xl bg-card p-12 kiosk-card-shadow text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-muted border-t-secondary" />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("submitting_request")}</h2>
              <p className="text-muted-foreground">{t("please_wait")}</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <CheckCircle2 className="h-20 w-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("request_submitted")}</h2>
              <p className="text-muted-foreground mb-1">{t("reference_id")}</p>
              <p className="text-xl font-bold text-primary mb-4 font-mono">{requestRef}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("use_ref_track_request")}</p>
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

export default ServiceRequestScreen;
