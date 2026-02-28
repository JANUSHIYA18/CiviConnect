import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { apiRequest, setAuthToken } from "@/lib/api";
import type { AppUser } from "@/types/api";

const AuthScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setAuthUser } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState("");

  const fullPhone = `+91${phone}`;

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    try {
      const data = await apiRequest<{ message: string; debugOtp?: string }>("/auth/send-otp", {
        method: "POST",
        body: { phone: fullPhone },
      });
      setDebugOtp(data.debugOtp || "");
      toast.success(`${t("otp_sent_success")} ${fullPhone}`);
      setStep("otp");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("otp_send_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarLogin = async () => {
    if (aadhaar.length !== 12) return;
    setLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: AppUser }>("/auth/verify-aadhaar", {
        method: "POST",
        body: { phone: phone.length === 10 ? fullPhone : "", aadhaar },
      });
      setAuthToken(data.token);
      setAuthUser(data.user);
      toast.success(t("verified_success"));
      navigate("/services");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aadhaar verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: AppUser }>("/auth/verify-otp", {
        method: "POST",
        body: { phone: fullPhone, otp, aadhaar },
      });
      setAuthToken(data.token);
      setAuthUser(data.user);
      toast.success(t("verified_success"));
      navigate("/services");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("verify_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhaar = async () => {
    if (aadhaar.length !== 12) return;
    setLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: AppUser }>("/auth/verify-aadhaar", {
        method: "POST",
        body: { phone: fullPhone, aadhaar },
      });
      setAuthToken(data.token);
      setAuthUser(data.user);
      toast.success(t("verified_success"));
      navigate("/services");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aadhaar verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskLayout title={t("auth_title")} subtitle={t("step_2_of_5")} showLogout>
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
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("enter_phone")}</h2>
                <p className="text-muted-foreground text-center mb-6">{t("send_otp_help")}</p>
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
                  <Input
                    type="text"
                    placeholder={t("aadhaar_optional")}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    className="h-12 rounded-xl"
                  />
                  <Button
                    variant="kiosk"
                    className="w-full h-14"
                    onClick={handleSendOtp}
                    disabled={phone.length < 10 || loading}
                  >
                    {loading ? t("sending_otp") : t("send_otp")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">OR</div>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleAadhaarLogin}
                    disabled={aadhaar.length !== 12 || loading}
                  >
                    {loading ? "Verifying..." : "Continue with Aadhaar"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{t("verify_otp")}</h2>
                <p className="text-muted-foreground text-center mb-6">
                  {t("otp_sent_to")} {fullPhone}
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
                    {loading ? t("verifying") : t("verify_continue")}
                    <LogIn className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">OR</div>
                  <Input
                    type="text"
                    placeholder="Enter 12-digit Aadhaar"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    className="h-12 rounded-xl"
                    maxLength={12}
                  />
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleVerifyAadhaar}
                    disabled={aadhaar.length !== 12 || loading}
                  >
                    {loading ? "Verifying..." : "Verify with Aadhaar"}
                  </Button>
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                  >
                    {t("change_phone_number")}
                  </button>
                  {debugOtp && (
                    <p className="text-xs text-center text-muted-foreground">
                      {t("dev_otp")}: <span className="font-mono">{debugOtp}</span>
                    </p>
                  )}
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
