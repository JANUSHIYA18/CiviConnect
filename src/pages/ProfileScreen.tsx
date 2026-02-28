import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Home, IdCard, Mail, Phone, UserCircle2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeStatus } from "@/lib/i18nFormat";
import type { ProfileDetails } from "@/types/api";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ profile: ProfileDetails }>("/me/profile")
      .then((data) => setProfile(data.profile))
      .catch((e) => setError(e instanceof Error ? e.message : t("error_load_profile")));
  }, [user, navigate, t]);

  return (
    <KioskLayout title={t("title_my_profile")} subtitle={t("subtitle_resident_details")} showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            {t("back_to_services")}
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !profile && <p className="text-sm text-muted-foreground">{t("loading_profile")}</p>}

        {profile && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 kiosk-card-shadow">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-10 w-10 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">{profile.fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("resident_id")} {profile.profileId} - {profile.ward}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">{t("identity_contact")}</p>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2"><IdCard className="h-4 w-4 text-primary" /> {t("aadhaar")}: {profile.aadhaarMasked}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {t("phone")}: +91 {profile.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {t("email")}: {profile.email}</p>
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">{t("address_ward_data")}</p>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start gap-2"><Home className="mt-0.5 h-4 w-4 text-primary" /> {profile.address}</p>
                  <p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> {t("ward")}: {profile.ward}</p>
                  <p>{t("last_updated")}: {new Date(profile.updatedAt).toLocaleString("en-IN")}</p>
                </div>
              </article>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-sm font-semibold text-muted-foreground">{t("upcoming_personal_reminders")}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {profile.reminders.map((item) => (
                  <div key={item.reminderId} className="rounded-xl border border-border px-4 py-3 text-sm">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted-foreground">{t("due_date")}: {item.dueDate}</p>
                    <p className="text-muted-foreground">{t("status")}: {localizeStatus(item.status, t)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default ProfileScreen;
