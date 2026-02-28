import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileQuickPanel from "@/components/kiosk/ProfileQuickPanel";

interface KioskLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
  showProfileMenu?: boolean;
}

const KioskLayout = ({
  children,
  showHeader = true,
  title,
  subtitle,
  showLogout = true,
  showProfileMenu = true,
}: KioskLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const hideProfileOnPublicRoutes = ["/", "/language", "/auth"].includes(location.pathname);
  const canShowProfileMenu = Boolean(user) && showProfileMenu && !hideProfileOnPublicRoutes;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {showHeader && (
        <header className="kiosk-hero-gradient px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              {canShowProfileMenu && <ProfileQuickPanel />}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-secondary-foreground text-sm">
                CC
              </div>
              <span className="text-lg font-bold text-primary-foreground">{t("app_name")}</span>
            </div>
            <div className="flex items-center gap-3">
              {title && (
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-foreground/80">{subtitle}</p>
                  <p className="text-lg font-bold text-primary-foreground">{title}</p>
                </div>
              )}
              {user && showLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 border-primary-foreground/40 bg-primary-foreground/10 px-3 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {t("logout")}
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="flex flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border bg-card px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between text-xs text-muted-foreground">
          <span>{t("footer_tagline")}</span>
          <span>{t("powered_by")}</span>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;

