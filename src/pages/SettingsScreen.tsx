import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeLanguage, localizeReceiptMode, localizeServiceType, localizeStartPage } from "@/lib/i18nFormat";
import type { ProfileSettings } from "@/types/api";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ settings: ProfileSettings }>("/me/settings")
      .then((data) => setSettings(data.settings))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_load_settings")));
  }, [user, navigate, t]);

  return (
    <KioskLayout title={t("menu_settings")} subtitle={t("subtitle_preferences_security")} showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            {t("back_to_services")}
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !settings && <p className="text-sm text-muted-foreground">{t("loading_settings")}</p>}

        {settings && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Settings2 className="h-5 w-5 text-primary" />
                {t("notif_receipt_preferences")}
              </h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>{t("language")}: <span className="font-semibold">{localizeLanguage(settings.language, t)}</span></p>
                <p>{t("receipt_mode")}: <span className="font-semibold">{localizeReceiptMode(settings.receiptMode, t)}</span></p>
                <p>{t("sms_alerts")}: <span className="font-semibold">{settings.smsAlerts ? t("enabled") : t("disabled")}</span></p>
                <p>{t("email_alerts")}: <span className="font-semibold">{settings.emailAlerts ? t("enabled") : t("disabled")}</span></p>
                <p>{t("push_alerts")}: <span className="font-semibold">{settings.pushAlerts ? t("enabled") : t("disabled")}</span></p>
                <p>{t("paperless_receipts")}: <span className="font-semibold">{settings.paperlessReceipts ? t("enabled") : t("disabled")}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">{t("accessibility_session")}</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>{t("kiosk_accessibility_mode")}: <span className="font-semibold">{settings.kioskAccessibilityMode ? t("enabled") : t("disabled")}</span></p>
                <p>{t("high_contrast_mode")}: <span className="font-semibold">{settings.highContrastMode ? t("enabled") : t("disabled")}</span></p>
                <p>{t("large_text_mode")}: <span className="font-semibold">{settings.largeTextMode ? t("enabled") : t("disabled")}</span></p>
                <p>{t("auto_logout_window")}: <span className="font-semibold">{settings.autoLogoutMinutes} {t("minutes_short")}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">{t("security_startup")}</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>{t("biometric_lock")}: <span className="font-semibold">{settings.biometricLock ? t("enabled") : t("disabled")}</span></p>
                <p>{t("default_service")}: <span className="font-semibold">{localizeServiceType(settings.defaultService, t)}</span></p>
                <p>{t("preferred_start_page")}: <span className="font-semibold">{localizeStartPage(settings.startPage, t)}</span></p>
              </div>
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default SettingsScreen;
