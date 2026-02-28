import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download, FileCheck2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, apiRequest, getAuthToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeReceiptMode, localizeServiceType, localizeStatus } from "@/lib/i18nFormat";
import type { ReceiptDetails } from "@/types/api";

const PaymentDetailsScreen = () => {
  const navigate = useNavigate();
  const { transactionRef = "" } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!transactionRef) return;

    apiRequest<ReceiptDetails>(`/receipts/${encodeURIComponent(transactionRef)}`)
      .then((data) => setReceipt(data))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_load_payment_details")));
  }, [transactionRef, user, navigate, t]);

  const handleDownload = async () => {
    if (!transactionRef) return;
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/receipts/${encodeURIComponent(transactionRef)}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(t("error_download_receipt"));
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${transactionRef}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <KioskLayout title={t("payment_details")} subtitle={t("receipt_summary")} showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4 flex gap-3">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            {t("back_to_services")}
          </Button>
          <Button variant="kioskOutline" onClick={() => navigate("/profile/downloads")}>
            {t("menu_downloads")}
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !receipt && <p className="text-sm text-muted-foreground">{t("loading_payment_details")}</p>}

        {receipt && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <FileCheck2 className="h-5 w-5 text-primary" /> {t("transaction_information")}
              </h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>{t("transaction_id")}: <span className="font-semibold">{receipt.transactionRef}</span></p>
                <p>{t("status")}: <span className="font-semibold">{localizeStatus(receipt.status, t)}</span></p>
                <p>{t("date")}: <span className="font-semibold">{receipt.transactionDateTime}</span></p>
                <p>{t("service")}: <span className="font-semibold">{localizeServiceType(receipt.serviceType, t)}</span></p>
                <p>{t("account")}: <span className="font-semibold">{receipt.accountId}</span></p>
                <p>{t("period")}: <span className="font-semibold">{receipt.billPeriod || t("not_available")}</span></p>
                <p>{t("amount_due")}: <span className="font-semibold">Rs. {receipt.amount.toLocaleString("en-IN")}</span></p>
                <p>{t("receipt_mode")}: <span className="font-semibold">{localizeReceiptMode(receipt.receiptMode, t)}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">{t("resident_information")}</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>{t("name")}: <span className="font-semibold">{receipt.fullName}</span></p>
                <p>{t("phone")}: <span className="font-semibold">+91 {receipt.phone}</span></p>
                <p>{t("email")}: <span className="font-semibold">{receipt.email}</span></p>
                <p>{t("ward")}: <span className="font-semibold">{receipt.ward}</span></p>
                <p>{t("aadhaar")}: <span className="font-semibold">{receipt.aadhaarMasked}</span></p>
                <p>{t("address")}: <span className="font-semibold">{receipt.address}</span></p>
              </div>
            </section>

            <section>
              <Button variant="kiosk" onClick={handleDownload}>
                <Download className="mr-2 h-5 w-5" /> {t("download_receipt_pdf")}
              </Button>
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default PaymentDetailsScreen;
