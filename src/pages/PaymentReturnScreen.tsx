import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
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
        setError("Missing transaction reference");
        setLoading(false);
        return;
      }

      apiRequest<{
        transactionRef: string;
        amount: number;
      }>(`/receipts/${encodeURIComponent(transactionRef)}`)
        .then((data) =>
          setResult({
            sessionId: "DEMO-PAYMENT",
            status: "complete",
            paymentStatus: "paid",
            transactionRef: data.transactionRef,
            amount: data.amount,
          })
        )
        .catch((e) => setError(e instanceof Error ? e.message : "Could not verify demo payment status"))
        .finally(() => setLoading(false));
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Missing Stripe session ID");
      setLoading(false);
      return;
    }

    apiRequest<SessionStatusResponse>(`/payments/session/${encodeURIComponent(sessionId)}`)
      .then((data) => setResult(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not verify payment status"))
      .finally(() => setLoading(false));
  }, [mode, authLoading, user, searchParams]);

  const handleDownloadReceipt = async () => {
    if (!result?.transactionRef) return;
    setDownloading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/receipts/${encodeURIComponent(result.transactionRef)}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Could not download receipt");
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
    <KioskLayout title="Payment Status" subtitle="Stripe Checkout" showLogout={false} showProfileMenu={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full ${mode === "success" && !loading && !error ? "max-w-2xl" : "max-w-md"}`}
        >
          {mode === "cancel" && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">Payment Cancelled</h2>
              <p className="mb-6 text-muted-foreground">No amount has been charged. You can retry your payment.</p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>
                  Back to Services
                </Button>
                <Button
                  variant="kiosk"
                  className="flex-1 h-14"
                  onClick={() => navigate(serviceType ? `/payment/${serviceType}` : "/services")}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {mode === "success" && loading && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-primary" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">Verifying Payment</h2>
              <p className="text-muted-foreground">Please wait while we confirm your Stripe transaction.</p>
            </div>
          )}

          {mode === "success" && !loading && error && (
            <div className="rounded-2xl bg-card p-8 text-center kiosk-card-shadow">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">Unable to Verify Payment</h2>
              <p className="mb-6 text-muted-foreground">{error}</p>
              <Button variant="kiosk" className="w-full h-14" onClick={() => navigate("/track")}>
                Track by Reference <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {mode === "success" && !loading && !error && (
            <div className="rounded-2xl bg-card p-10 text-center kiosk-card-shadow">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-accent" />
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">Payment Successful</h2>
              <p className="mb-1 text-muted-foreground">Stripe Session: {result?.sessionId}</p>
              <p className="mb-4 text-muted-foreground">
                Transaction Ref: {result?.transactionRef || "Will appear shortly in tracking"}
              </p>
              <p className="mb-8 font-semibold text-primary">Rs. {(result?.amount || 0).toLocaleString("en-IN")}</p>

              <div className="mx-auto grid w-full max-w-[560px] grid-cols-2 gap-4">
                <Button
                  variant="kioskOutline"
                  className="h-16 w-full px-6 text-lg font-semibold leading-none"
                  onClick={() => navigate("/services")}
                >
                  More Services
                </Button>
                <Button
                  variant="kiosk"
                  className="h-16 w-full px-6 text-lg font-semibold leading-none"
                  onClick={() => navigate("/track")}
                >
                  Track Status
                </Button>
                <Button
                  variant="kioskOutline"
                  className="h-16 w-full px-6 text-lg font-semibold leading-none [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0"
                  onClick={() => result?.transactionRef && navigate(`/payment/details/${result.transactionRef}`)}
                  disabled={!result?.transactionRef}
                >
                  <Eye className="h-5 w-5" />
                  View Payment Details
                </Button>
                <Button
                  variant="kiosk"
                  className="h-16 w-full px-6 text-lg font-semibold leading-none [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0"
                  onClick={handleDownloadReceipt}
                  disabled={!result?.transactionRef || downloading}
                >
                  <Download className="h-5 w-5" />
                  {downloading ? "Downloading..." : "Download Receipt"}
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
