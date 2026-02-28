import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, IndianRupee, ReceiptText } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeServiceType, localizeStatus } from "@/lib/i18nFormat";
import type { PendingBill } from "@/types/api";

const PendingBillsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bills, setBills] = useState<PendingBill[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ pendingBills: PendingBill[] }>("/me/pending-bills")
      .then((data) => setBills(data.pendingBills || []))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_load_pending_bills")));
  }, [user, navigate, t]);

  const totalAmount = useMemo(() => bills.reduce((sum, bill) => sum + bill.amount, 0), [bills]);

  return (
    <KioskLayout title={t("menu_pending_bills")} subtitle={t("subtitle_outstanding_payments")} showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            {t("back_to_services")}
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">{t("total_bills")}</p>
                <p className="text-3xl font-bold">{bills.length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">{t("total_due")}</p>
                <p className="flex items-center text-3xl font-bold">
                  <IndianRupee className="mr-1 h-6 w-6" />
                  {totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">{t("nearest_due_date")}</p>
                <p className="text-2xl font-bold">{bills[0]?.dueDate || t("not_available")}</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {bills.map((bill) => (
                <article key={bill.billRef} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <ReceiptText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold uppercase">{localizeServiceType(bill.serviceType, t)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("bill_reference")}: {bill.billRef}</p>
                  <p className="mt-3 flex items-center text-xl font-bold">
                    <IndianRupee className="mr-1 h-5 w-5" />
                    {bill.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" /> {t("due_by")} {bill.dueDate}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("status")}: {localizeStatus(bill.status, t)}</p>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default PendingBillsScreen;
