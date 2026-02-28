import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Clock, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrackingResult {
  ref: string;
  type: string;
  status: string;
  date: string;
  description: string;
}

const StatusTrackingScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: t("status_pending"), icon: Clock, color: "text-secondary" },
    in_progress: { label: t("status_in_progress"), icon: Loader2, color: "text-accent" },
    completed: { label: t("status_completed"), icon: CheckCircle2, color: "text-accent" },
    rejected: { label: t("status_rejected"), icon: XCircle, color: "text-destructive" },
  };

  const handleSearch = () => {
    if (!refId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);

    apiRequest<TrackingResult>(`/tracking/${encodeURIComponent(refId.trim())}`)
      .then((data) => setResult(data))
      .catch((error) => {
        setNotFound(true);
        toast.error(error instanceof Error ? error.message : t("no_records_found"));
      })
      .finally(() => setLoading(false));
  };

  const statusInfo = result ? statusConfig[result.status] || statusConfig.pending : null;

  return (
    <KioskLayout title={t("track_status")} subtitle={t("track_progress")} showLogout>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
          <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("track_your_request")}</h2>
            <p className="text-muted-foreground text-center mb-6">{t("enter_reference_help")}</p>
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              {t("tracking_help_input")}
            </div>
            <div className="space-y-4">
              <Input
                placeholder="e.g., CMP-A1B2C3D4"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                className="h-14 text-lg rounded-xl text-center font-mono tracking-wider"
              />
              <Button variant="kiosk" className="w-full h-14" onClick={handleSearch} disabled={!refId.trim() || loading}>
                {loading ? t("searching") : t("track_status")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {result && statusInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <div className="flex items-center justify-center gap-2 mb-4">
                <statusInfo.icon className={`h-8 w-8 ${statusInfo.color}`} />
                <span className={`text-xl font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("reference_id").replace(":", "")}</span>
                  <span className="font-mono font-medium text-card-foreground">{result.ref}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("type")}</span>
                  <span className="font-medium text-card-foreground">{result.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("date")}</span>
                  <span className="font-medium text-card-foreground">{result.date}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t("details")}</span>
                  <span className="font-medium text-card-foreground text-right max-w-[200px]">{result.description}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between px-2">
                {[t("timeline_submitted"), t("timeline_in_progress"), t("timeline_completed")].map((s, i) => {
                  const isActive = i === 0 || (i === 1 && result.status !== "pending") || (i === 2 && result.status === "completed");
                  return (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className={`h-4 w-4 rounded-full ${isActive ? "bg-accent" : "bg-muted"}`} />
                      <span className={`text-xs ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Button variant="kioskOutline" className="w-full h-12" onClick={() => navigate("/services")}>
                  {t("back_to_services")}
                </Button>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
              <p className="text-card-foreground font-medium">{t("no_records_found")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("check_ref_try_again")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default StatusTrackingScreen;
