import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AuthScreen = () => {
  const navigate = useNavigate();
  const { setDemoUser } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const fullPhone = `+91${phone}`;

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    // Demo mode: simulate OTP send
    setTimeout(() => {
      toast.success("OTP sent to " + fullPhone + " (Demo: enter any 6 digits)");
      setStep("otp");
      setLoading(false);
    }, 800);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    // Demo mode: accept any 6-digit OTP
    setTimeout(() => {
      setDemoUser(fullPhone);
      toast.success("Verified successfully!");
      navigate("/services");
      setLoading(false);
    }, 1000);
  };

  return (
    <KioskLayout title="Authentication" subtitle="Step 2 of 5">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
              {step === "phone" ? (
                <Phone className="h-8 w-8 text-primary" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-primary" />
              )}
            </div>

            {step === "phone" ? (
              <>
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                  Enter Phone Number
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  We'll send a 6-digit OTP to verify your identity
                </p>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="h-14 text-xl rounded-xl pl-12 tracking-wider"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    variant="kiosk"
                    className="w-full h-14"
                    onClick={handleSendOtp}
                    disabled={phone.length < 10 || loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                  Verify OTP
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Enter the 6-digit code sent to {fullPhone}
                </p>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    variant="kiosk"
                    className="w-full h-14"
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 6 || loading}
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                    <LogIn className="ml-2 h-5 w-5" />
                  </Button>
                  <button
                    onClick={() => { setStep("phone"); setOtp(""); }}
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                  >
                    Change phone number
                  </button>
                </div>
              </>
            )}

            <p className="mt-4 text-xs text-center text-muted-foreground/60">
              Demo mode — any 6-digit code is accepted
            </p>
          </div>
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default AuthScreen;
