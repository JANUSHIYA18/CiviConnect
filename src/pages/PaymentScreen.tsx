import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, QrCode, ArrowRight, IndianRupee, CheckCircle2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const mockBillData: Record<string, { nameKey: string; amount: number; account: string; dueDate: string; period: string }> = {
  electricity: { nameKey: "service_electricity", amount: 2450, account: "ELEC-29384756", dueDate: "15 Mar 2026", period: "Feb 2026" },
  gas: { nameKey: "service_gas", amount: 890, account: "GAS-19283746", dueDate: "20 Mar 2026", period: "Feb 2026" },
  water: { nameKey: "service_water", amount: 560, account: "WAT-83746592", dueDate: "18 Mar 2026", period: "Feb 2026" },
  waste: { nameKey: "service_waste", amount: 350, account: "WST-47382916", dueDate: "25 Mar 2026", period: "Q1 2026" },
  property: { nameKey: "service_property", amount: 12500, account: "PROP-29384756", dueDate: "31 Mar 2026", period: "FY 2025-26" },
  certificates: { nameKey: "service_certificates", amount: 150, account: "CERT-00000", dueDate: "N/A", period: "N/A" },
};

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<"lookup" | "review" | "processing" | "done">("lookup");
  const [accountId, setAccountId] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [resolvedBill, setResolvedBill] = useState(mockBillData[serviceId || "electricity"] || mockBillData.electricity);

  const bill = resolvedBill;
  const billName = t(bill.nameKey);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const handleLookup = async () => {
    if (!accountId.trim()) return;
    try {
      const data = await apiRequest<{
        bill: { amount: number; accountId: string; dueDate: string; period: string; serviceType: string };
      }>("/bills/lookup", {
        method: "POST",
        body: {
          serviceType: serviceId || "electricity",
          accountId,
        },
      });
      setResolvedBill({
        ...bill,
        amount: data.bill.amount,
        account: data.bill.accountId,
        dueDate: data.bill.dueDate,
        period: data.bill.period,
      });
      setStep("review");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("lookup_failed"));
    }
  };

  useEffect(() => {
    const shouldOpenReview = searchParams.get("review") === "1";
    const returnAccountId = searchParams.get("accountId")?.trim() || "";
    if (loading || !user || !shouldOpenReview || !returnAccountId) return;

    const restoreReview = async () => {
      try {
        const data = await apiRequest<{
          bill: { amount: number; accountId: string; dueDate: string; period: string; serviceType: string };
        }>("/bills/lookup", {
          method: "POST",
          body: {
            serviceType: serviceId || "electricity",
            accountId: returnAccountId,
          },
        });

        setAccountId(returnAccountId);
        setResolvedBill((prev) => ({
          ...prev,
          amount: data.bill.amount,
          account: data.bill.accountId,
          dueDate: data.bill.dueDate,
          period: data.bill.period,
        }));
        setStep("review");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("lookup_failed"));
      }
    };

    restoreReview();
  }, [loading, user, searchParams, serviceId, t]);

  const handlePay = async () => {
    setStep("processing");
    try {
      const data = await apiRequest<{ sessionId: string; sessionUrl: string }>("/payments/checkout-session", {
        method: "POST",
        body: {
          serviceType: serviceId || "electricity",
          accountId: accountId || bill.account,
          amount: bill.amount,
          billPeriod: bill.period,
          receiptMode: "both",
        },
      });
      if (!data.sessionUrl) {
        throw new Error("Could not create checkout session");
      }
      window.location.href = data.sessionUrl;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("payment_failed"));
      setStep("review");
    }
  };

  const handleDemoSuccess = async () => {
    setStep("processing");
    try {
      const data = await apiRequest<{ transactionRef: string; amount: number; status: string }>("/payments/demo-complete", {
        method: "POST",
        body: {
          serviceType: serviceId || "electricity",
          accountId: accountId || bill.account,
          amount: bill.amount,
          billPeriod: bill.period,
          receiptMode: "both",
        },
      });

      navigate(`/payment/success?demo=1&transaction_ref=${encodeURIComponent(data.transactionRef)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not complete demo payment");
      setStep("review");
    }
  };

  return (
    <KioskLayout title={t("pay_now")} subtitle={t("step_4_of_5")} showLogout showProfileMenu={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {step === "lookup" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("payment_enter_account")}</h2>
              <p className="text-muted-foreground text-center mb-6">{t("payment_scan_qr")}</p>
              <div className="space-y-4">
                <Input
                  placeholder="e.g., ELEC-29384756"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="h-12 text-lg rounded-xl text-center"
                />
                <Button variant="kiosk" className="w-full h-14" onClick={handleLookup} disabled={!accountId}>
                  {t("fetch_bill_details")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-6">{t("bill_summary")}</h2>
              <p className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-center text-xs text-muted-foreground">
                {t("payment_gateway_note")}
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("service")}</span>
                  <span className="font-medium text-card-foreground">{billName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("account")}</span>
                  <span className="font-medium text-card-foreground">{bill.account}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("period")}</span>
                  <span className="font-medium text-card-foreground">{bill.period}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("due_date")}</span>
                  <span className="font-medium text-card-foreground">{bill.dueDate}</span>
                </div>
                <div className="flex justify-between py-3 rounded-xl bg-primary/5 px-4">
                  <span className="font-bold text-card-foreground text-lg">{t("amount_due")}</span>
                  <span className="font-bold text-primary text-lg flex items-center">
                    <IndianRupee className="h-5 w-5 mr-0.5" />
                    {bill.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("lookup")}>
                    {t("back")}
                  </Button>
                  <Button variant="kiosk" className="flex-1 h-14" onClick={handlePay}>
                    <CreditCard className="mr-2 h-5 w-5" />
                    {t("pay_with_stripe")}
                  </Button>
                </div>
                <Button variant="outline" className="w-full h-12" onClick={handleDemoSuccess}>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Demo Success (No Charge)
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="rounded-2xl bg-card p-12 kiosk-card-shadow text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-muted border-t-secondary"
              />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("payment_processing")}</h2>
              <p className="text-muted-foreground">{t("payment_processing_wait")}</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4"
              >
                <CheckCircle2 className="h-20 w-20 text-accent mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{t("payment_success")}</h2>
              <p className="text-muted-foreground mb-1">
                {t("transaction_id")} {txnRef || `TXN-${Date.now().toString().slice(-8)}`}
              </p>
              <p className="text-muted-foreground mb-6">
                <span className="font-semibold text-primary flex items-center justify-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {bill.amount.toLocaleString("en-IN")}
                </span>
                {` ${billName}`}
              </p>
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

export default PaymentScreen;
