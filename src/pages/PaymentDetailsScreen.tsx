import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download, FileCheck2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, apiRequest, getAuthToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ReceiptDetails } from "@/types/api";

const PaymentDetailsScreen = () => {
  const navigate = useNavigate();
  const { transactionRef = "" } = useParams();
  const { user } = useAuth();
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
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load payment details"));
  }, [transactionRef, user, navigate]);

  const handleDownload = async () => {
    if (!transactionRef) return;
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
  };

  return (
    <KioskLayout title="Payment Details" subtitle="Receipt Summary" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4 flex gap-3">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
          <Button variant="kioskOutline" onClick={() => navigate("/profile/downloads")}>
            My Downloads
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !receipt && <p className="text-sm text-muted-foreground">Loading payment details...</p>}

        {receipt && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <FileCheck2 className="h-5 w-5 text-primary" /> Transaction Information
              </h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Transaction Ref: <span className="font-semibold">{receipt.transactionRef}</span></p>
                <p>Status: <span className="font-semibold">{receipt.status}</span></p>
                <p>Date & Time: <span className="font-semibold">{receipt.transactionDateTime}</span></p>
                <p>Service: <span className="font-semibold">{receipt.serviceType}</span></p>
                <p>Account ID: <span className="font-semibold">{receipt.accountId}</span></p>
                <p>Bill Period: <span className="font-semibold">{receipt.billPeriod || "N/A"}</span></p>
                <p>Amount Paid: <span className="font-semibold">Rs. {receipt.amount.toLocaleString("en-IN")}</span></p>
                <p>Receipt Mode: <span className="font-semibold">{receipt.receiptMode}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">Resident Information</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Name: <span className="font-semibold">{receipt.fullName}</span></p>
                <p>Phone: <span className="font-semibold">+91 {receipt.phone}</span></p>
                <p>Email: <span className="font-semibold">{receipt.email}</span></p>
                <p>Ward: <span className="font-semibold">{receipt.ward}</span></p>
                <p>Aadhaar: <span className="font-semibold">{receipt.aadhaarMasked}</span></p>
                <p>Address: <span className="font-semibold">{receipt.address}</span></p>
              </div>
            </section>

            <section>
              <Button variant="kiosk" onClick={handleDownload}>
                <Download className="mr-2 h-5 w-5" /> Download Payment Receipt (PDF)
              </Button>
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default PaymentDetailsScreen;
