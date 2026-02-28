import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ProfileSettings } from "@/types/api";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ settings: ProfileSettings }>("/me/settings")
      .then((data) => setSettings(data.settings))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load settings"));
  }, [user, navigate]);

  return (
    <KioskLayout title="Settings" subtitle="Preferences & Security" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !settings && <p className="text-sm text-muted-foreground">Loading settings...</p>}

        {settings && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Settings2 className="h-5 w-5 text-primary" />
                Notification & Receipt Preferences
              </h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Language: <span className="font-semibold">{settings.language}</span></p>
                <p>Receipt mode: <span className="font-semibold">{settings.receiptMode}</span></p>
                <p>SMS alerts: <span className="font-semibold">{settings.smsAlerts ? "Enabled" : "Disabled"}</span></p>
                <p>Email alerts: <span className="font-semibold">{settings.emailAlerts ? "Enabled" : "Disabled"}</span></p>
                <p>Push alerts: <span className="font-semibold">{settings.pushAlerts ? "Enabled" : "Disabled"}</span></p>
                <p>Paperless receipts: <span className="font-semibold">{settings.paperlessReceipts ? "Enabled" : "Disabled"}</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">Accessibility & Session</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Kiosk accessibility mode: <span className="font-semibold">{settings.kioskAccessibilityMode ? "Enabled" : "Disabled"}</span></p>
                <p>High contrast mode: <span className="font-semibold">{settings.highContrastMode ? "Enabled" : "Disabled"}</span></p>
                <p>Large text mode: <span className="font-semibold">{settings.largeTextMode ? "Enabled" : "Disabled"}</span></p>
                <p>Auto logout window: <span className="font-semibold">{settings.autoLogoutMinutes} min</span></p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">Security & Startup</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Biometric lock: <span className="font-semibold">{settings.biometricLock ? "Enabled" : "Disabled"}</span></p>
                <p>Default service: <span className="font-semibold">{settings.defaultService}</span></p>
                <p>Preferred start page: <span className="font-semibold">{settings.startPage}</span></p>
              </div>
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default SettingsScreen;
