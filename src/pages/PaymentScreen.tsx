import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, QrCode, ArrowRight, IndianRupee, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KioskLayout from "@/components/kiosk/KioskLayout";

const mockBillData: Record<string, { name: string; amount: number; account: string; dueDate: string; period: string }> = {
  electricity: { name: "Electricity Bill", amount: 2450, account: "ELEC-29384756", dueDate: "15 Mar 2026", period: "Feb 2026" },
  gas: { name: "Gas Bill", amount: 890, account: "GAS-19283746", dueDate: "20 Mar 2026", period: "Feb 2026" },
  water: { name: "Water Supply Bill", amount: 560, account: "WAT-83746592", dueDate: "18 Mar 2026", period: "Feb 2026" },
  waste: { name: "Waste Management Fee", amount: 350, account: "WST-47382916", dueDate: "25 Mar 2026", period: "Q1 2026" },
  property: { name: "Property Tax", amount: 12500, account: "PROP-29384756", dueDate: "31 Mar 2026", period: "FY 2025-26" },
  certificates: { name: "Certificate Fee", amount: 150, account: "CERT-00000", dueDate: "N/A", period: "N/A" },
};

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [step, setStep] = useState<"lookup" | "review" | "processing" | "done">("lookup");
  const [accountId, setAccountId] = useState("");

  const bill = mockBillData[serviceId || "electricity"] || mockBillData.electricity;

  const handleLookup = () => {
    if (accountId.length > 0) setStep("review");
  };

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2000);
  };

  return (
    <KioskLayout title={bill.name} subtitle="Step 4 of 5">
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
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                Enter Account ID
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                Or scan the QR code on your bill
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="e.g., ELEC-29384756"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="h-12 text-lg rounded-xl text-center"
                />
                <Button variant="kiosk" className="w-full h-14" onClick={handleLookup} disabled={!accountId}>
                  Fetch Bill Details
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
              <h2 className="text-2xl font-bold text-card-foreground text-center mb-6">
                Bill Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-card-foreground">{bill.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium text-card-foreground">{bill.account}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium text-card-foreground">{bill.period}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium text-card-foreground">{bill.dueDate}</span>
                </div>
                <div className="flex justify-between py-3 rounded-xl bg-primary/5 px-4">
                  <span className="font-bold text-card-foreground text-lg">Amount Due</span>
                  <span className="font-bold text-primary text-lg flex items-center">
                    <IndianRupee className="h-5 w-5 mr-0.5" />
                    {bill.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => setStep("lookup")}>
                  Back
                </Button>
                <Button variant="kiosk" className="flex-1 h-14" onClick={handlePay}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay Now
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
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Processing Payment</h2>
              <p className="text-muted-foreground">Please wait while we process your transaction...</p>
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
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-1">Transaction ID: TXN-{Date.now().toString().slice(-8)}</p>
              <p className="text-muted-foreground mb-6">
                <span className="font-semibold text-primary flex items-center justify-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {bill.amount.toLocaleString("en-IN")}
                </span>
                paid for {bill.name}
              </p>
              <div className="flex gap-3">
                <Button variant="kioskOutline" className="flex-1 h-14" onClick={() => navigate("/services")}>
                  More Services
                </Button>
                <Button variant="kiosk" className="flex-1 h-14" onClick={() => navigate("/")}>
                  Done
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
