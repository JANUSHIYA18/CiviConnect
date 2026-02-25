import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import KioskLayout from "@/components/kiosk/KioskLayout";

const AuthScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setStep("otp");
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      navigate("/services");
    }
  };

  return (
    <KioskLayout title="Authentication" subtitle="Step 2 of 5">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
            {step === "phone" ? (
              <>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                  Enter Mobile Number
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  We'll send a one-time password to verify your identity
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-muted px-3 py-3 text-sm font-medium text-muted-foreground">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="h-12 text-lg rounded-xl"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    variant="kiosk"
                    className="w-full h-14"
                    onClick={handleSendOtp}
                    disabled={phone.length < 10}
                  >
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 mx-auto">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                  Enter OTP
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Sent to +91 {phone.slice(0, 2)}****{phone.slice(-2)}
                </p>
                <div className="flex flex-col items-center gap-6">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-14 text-xl" />
                      <InputOTPSlot index={1} className="h-14 w-14 text-xl" />
                      <InputOTPSlot index={2} className="h-14 w-14 text-xl" />
                      <InputOTPSlot index={3} className="h-14 w-14 text-xl" />
                      <InputOTPSlot index={4} className="h-14 w-14 text-xl" />
                      <InputOTPSlot index={5} className="h-14 w-14 text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    variant="kiosk"
                    className="w-full h-14"
                    onClick={handleVerify}
                    disabled={otp.length < 6}
                  >
                    Verify & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <button
                    onClick={() => setStep("phone")}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Change number
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default AuthScreen;
