import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const icons = [
    { Icon: Zap, label: t("service_electricity"), delay: 0.6 },
    { Icon: Flame, label: t("service_gas"), delay: 0.8 },
    { Icon: Building2, label: t("service_municipal"), delay: 1.0 },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center kiosk-hero-gradient px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-secondary/10" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary font-bold text-secondary-foreground text-3xl kiosk-card-shadow"
        >
          CC
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-2 text-5xl font-extrabold tracking-tight text-primary-foreground"
        >
          {t("app_name")}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 max-w-md text-lg text-primary-foreground/80"
        >
          {t("welcome_subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex gap-8"
        >
          {icons.map(({ Icon, label, delay }) => (
            <motion.div
              key={label}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                <Icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary-foreground/70">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Button
            variant="kiosk"
            size="lg"
            className="h-16 px-12 text-xl animate-pulse-glow"
            onClick={() => navigate("/language")}
          >
            {t("touch_to_begin")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex items-center gap-2 text-primary-foreground/50 text-sm"
        >
          <Shield className="h-4 w-4" />
          <span>{t("security_badge")}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

