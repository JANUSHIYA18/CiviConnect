import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AuthScreen = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to confirm, then sign in.");
          setMode("login");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          navigate("/services");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskLayout title="Authentication" subtitle="Step 2 of 5">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-card p-8 kiosk-card-shadow">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mx-auto">
              {mode === "login" ? (
                <LogIn className="h-8 w-8 text-primary" />
              ) : (
                <UserPlus className="h-8 w-8 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {mode === "login"
                ? "Enter your credentials to access services"
                : "Register to use SUVIDHA One services"}
            </p>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg rounded-xl pl-11"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg rounded-xl pl-11"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <Button
                variant="kiosk"
                className="w-full h-14"
                onClick={handleSubmit}
                disabled={!email || !password || loading}
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </KioskLayout>
  );
};

export default AuthScreen;
