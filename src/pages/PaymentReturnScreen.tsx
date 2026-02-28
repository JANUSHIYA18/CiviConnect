import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_BASE_URL, apiRequest, getAuthToken } from "@/lib/api";

interface PaymentReturnScreenProps {
  mode: "success" | "cancel";
}

interface SessionStatusResponse {
  sessionId: string;
  status: string;
  paymentStatus: string;
  transactionRef: string | null;
  amount: number;
}

const PaymentReturnScreen = ({ mode }: PaymentReturnScreenProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("serviceType");
  const [loading, setLoading] = useState(mode === "success");
  const [result, setResult] = useState<SessionStatusResponse | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (mode !== "success" || authLoading || !user) return;

    const isDemo = searchParams.get("demo") === "1";
    if (isDemo) {
      const transactionRef = searchParams.get("transaction_ref");
      if (!transactionRef) {
        setError(t("error_missing_txn_ref"));
        setLoading(false);
        return;
      }

      apiRequest<{ transactionRef: string; amount: number }>(`/receipts/${encodeURIComponent(transactionRef)}`)
        .then((data) =>
          setResult({
            sessionId: "DEMO-PAYMENT",
            status: "complete",
            paymentStatus: "paid",
            transactionRef: data.transactionRef,
            amount: data.amount,
          })
        )
        .catch((e) => setError(e instanceof Error ? e.message : t("error_verify_demo_payment")))
        .finally(() => setLoading(false));
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError(t("error_missing_session_id"));
      setLoading(false);
      return;
    }

    apiRequest<SessionStatusResponse>(`/payments/session/${encodeURIComponent(sessionId)}`)
      .then((data) => setResult(data))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_verify_payment_status")))
      .finally(() => setLoading(false));
  }, [mode, authLoading, user, searchParams, t]);

  const handleDownloadReceipt = async () => {
    if (!result?.transactionRef) return;
    setDownloading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/receipts/${encodeURIComponent(result.transactionRef)}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(t("error_download_receipt"));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${result.transactionRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <KioskLayout title={t("payment_status")} subtitle={t("stripe_checkout")} showLogout={false} showProfileMenu={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full ${mode === "success" && !loading && !error ? "max-w-2xl" : "max-w-md"}`}
        >
          {mode === "cancel" && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">{t("payment_cancelled")}</h2>
              <p className="mb-6 text-muted-foreground">{t("payment_cancelled_note")}</p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>
                  {t("back_to_services")}
                </Button>
                <Button
                  variant="kiosk"
                  className="flex-1 h-14"
                  onClick={() => navigate(serviceType ? `/payment/${serviceType}` : "/services")}
                >
                  {t("retry")}
                </Button>
              </div>
            </div>
          )}

          {mode === "success" && loading && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-primary" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">{t("payment_verifying")}</h2>
              <p className="text-muted-foreground">{t("payment_verifying_wait")}</p>
            </div>
          )}

          {mode === "success" && !loading && error && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">{t("unable_verify_payment")}</h2>
              <p className="mb-6 text-muted-foreground">{error}</p>
              <Button variant="kiosk" className="w-full h-14" onClick={() => navigate("/track")}>
                {t("track_by_reference")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {mode === "success" && !loading && !error && (
            <div className="rounded-2xl bg-card p-10 text-center kiosk-card-shadow">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-accent" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">{t("payment_success")}</h2>
              <p className="mb-1 text-muted-foreground">{t("stripe_session")}: {result?.sessionId}</p>
              <p className="mb-4 text-muted-foreground">
                {t("transaction_id")} {result?.transactionRef || t("txn_appear_shortly")}
              </p>
              <p className="mb-8 font-semibold text-primary">Rs. {(result?.amount || 0).toLocaleString("en-IN")}</p>

              <div className="mx-auto grid w-full max-w-[620px] grid-cols-2 gap-4 sm:gap-5">
                <Button
                  variant="kioskOutline"
                  className="h-20 w-full min-w-0 overflow-hidden px-3 text-center text-[15px] font-semibold leading-snug !whitespace-normal break-words sm:text-base"
                  onClick={() => navigate("/services")}
                >
                  {t("more_services")}
                </Button>
                <Button
                  variant="kiosk"
                  className="h-20 w-full min-w-0 overflow-hidden px-3 text-center text-[15px] font-semibold leading-snug !whitespace-normal break-words sm:text-base"
                  onClick={() => navigate("/track")}
                >
                  {t("track_status")}
                </Button>
                <Button
                  variant="kioskOutline"
                  className="h-20 w-full min-w-0 overflow-hidden px-3 text-center text-[15px] font-semibold leading-snug !whitespace-normal break-words sm:text-base [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0"
                  onClick={() => result?.transactionRef && navigate(`/payment/details/${result.transactionRef}`)}
                  disabled={!result?.transactionRef}
                >
                  <Eye className="h-5 w-5" />
                  {t("view_payment_details")}
                </Button>
                <Button
                  variant="kiosk"
                  className="h-20 w-full min-w-0 overflow-hidden px-3 text-center text-[15px] font-semibold leading-snug !whitespace-normal break-words sm:text-base [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0"
                  onClick={handleDownloadReceipt}
                  disabled={!result?.transactionRef || downloading}
                >
                  <Download className="h-5 w-5" />
                  {downloading ? t("downloading") : t("download_receipt")}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default PaymentReturnScreen;
