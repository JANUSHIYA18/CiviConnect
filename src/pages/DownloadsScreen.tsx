import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, apiRequest, getAuthToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeServiceType } from "@/lib/i18nFormat";
import type { DownloadRecord } from "@/types/api";

const DownloadsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<DownloadRecord[]>([]);
  const [error, setError] = useState("");

  const loadDownloads = () =>
    apiRequest<{ downloads: DownloadRecord[] }>("/me/downloads")
      .then((data) => setItems(data.downloads || []))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_load_downloads")));

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadDownloads();
  }, [user, navigate]);

  const handleDownload = async (transactionRef: string) => {
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
    await loadDownloads();
  };

  return (
    <KioskLayout title={t("menu_downloads")} subtitle={t("subtitle_receipt_library")} showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            {t("back_to_services")}
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={`${item.transactionRef}-${item.downloadedAt}`} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-lg font-semibold">{item.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {localizeServiceType(item.serviceType, t)} - {t("amount_short")} {item.amount.toLocaleString("en-IN")} - {t("downloaded_on")} {new Date(item.downloadedAt).toLocaleString("en-IN")}
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="kioskOutline" onClick={() => navigate(`/payment/details/${item.transactionRef}`)}>
                    <Eye className="mr-2 h-4 w-4" /> {t("view_details")}
                  </Button>
                  <Button variant="kiosk" onClick={() => handleDownload(item.transactionRef)}>
                    <Download className="mr-2 h-4 w-4" /> {t("download_again")}
                  </Button>
                </div>
              </article>
            ))}
            {!items.length && <p className="text-sm text-muted-foreground">{t("no_receipt_downloads")}</p>}
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default DownloadsScreen;
