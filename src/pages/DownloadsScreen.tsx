import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, apiRequest, getAuthToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DownloadRecord } from "@/types/api";

const DownloadsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<DownloadRecord[]>([]);
  const [error, setError] = useState("");

  const loadDownloads = () =>
    apiRequest<{ downloads: DownloadRecord[] }>("/me/downloads")
      .then((data) => setItems(data.downloads || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load downloads"));

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
    if (!response.ok) throw new Error("Could not download receipt");
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
    <KioskLayout title="My Downloads" subtitle="Receipt Library" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={`${item.transactionRef}-${item.downloadedAt}`} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-lg font-semibold">{item.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.serviceType.toUpperCase()} • Rs. {item.amount.toLocaleString("en-IN")} • Downloaded{" "}
                  {new Date(item.downloadedAt).toLocaleString("en-IN")}
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="kioskOutline" onClick={() => navigate(`/payment/details/${item.transactionRef}`)}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </Button>
                  <Button variant="kiosk" onClick={() => handleDownload(item.transactionRef)}>
                    <Download className="mr-2 h-4 w-4" /> Download Again
                  </Button>
                </div>
              </article>
            ))}
            {!items.length && <p className="text-sm text-muted-foreground">No receipt downloads yet.</p>}
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default DownloadsScreen;
