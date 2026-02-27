import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Clock, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-secondary" },
  in_progress: { label: "In Progress", icon: Loader2, color: "text-accent" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-accent" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-destructive" },
};

interface TrackingResult {
  ref: string;
  type: string;
  status: string;
  date: string;
  description: string;
}

const StatusTrackingScreen = () => {
  const navigate = useNavigate();
  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!refId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);

    // Demo: simulate lookup
    setTimeout(() => {
      const upper = refId.toUpperCase();
      if (upper.startsWith("CMP-") || upper.startsWith("SR-") || upper.startsWith("TXN-")) {
        const statuses = ["pending", "in_progress", "completed"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        setResult({
          ref: upper,
          type: upper.startsWith("CMP-") ? "Complaint" : upper.startsWith("SR-") ? "Service Request" : "Transaction",
          status: randomStatus,
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          description: upper.startsWith("CMP-")
            ? "Power outage in Sector 12"
            : upper.startsWith("SR-")
            ? "New electricity connection request"
            : "Electricity bill payment",
        });
      } else {
        setNotFound(true);
        toast.error("No records found for this reference ID");
      }
      setLoading(false);
    }, 1200);
  };

  const statusInfo = result ? statusConfig[result.status] || statusConfig.pending : null;

  return (
    <KioskLayout title="Track Status" subtitle="Check Progress">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
          <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">Track Your Request</h2>
            <p className="text-muted-foreground text-center mb-6">Enter your reference ID (CMP-xxx, SR-xxx, or TXN-xxx)</p>
            <div className="space-y-4">
              <Input
                placeholder="e.g., CMP-A1B2C3D4"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                className="h-14 text-lg rounded-xl text-center font-mono tracking-wider"
              />
              <Button variant="kiosk" className="w-full h-14" onClick={handleSearch} disabled={!refId.trim() || loading}>
                {loading ? "Searching..." : "Track Status"}
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
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-medium text-card-foreground">{result.ref}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-card-foreground">{result.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-card-foreground">{result.date}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Details</span>
                  <span className="font-medium text-card-foreground text-right max-w-[200px]">{result.description}</span>
                </div>
              </div>
              {/* Status timeline */}
              <div className="mt-6 flex items-center justify-between px-2">
                {["Submitted", "In Progress", "Completed"].map((s, i) => {
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
                  Back to Services
                </Button>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card p-8 kiosk-card-shadow text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
              <p className="text-card-foreground font-medium">No records found</p>
              <p className="text-sm text-muted-foreground mt-1">Please check your reference ID and try again</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default StatusTrackingScreen;
