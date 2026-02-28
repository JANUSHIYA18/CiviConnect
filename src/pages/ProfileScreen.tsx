import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Home, IdCard, Mail, Phone, UserCircle2 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ProfileDetails } from "@/types/api";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ profile: ProfileDetails }>("/me/profile")
      .then((data) => setProfile(data.profile))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load profile"));
  }, [user, navigate]);

  return (
    <KioskLayout title="My Profile" subtitle="Resident Details" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {!error && !profile && <p className="text-sm text-muted-foreground">Loading profile...</p>}

        {profile && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 kiosk-card-shadow">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-10 w-10 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">{profile.fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Resident ID {profile.profileId} • {profile.ward}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">Identity & Contact</p>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2"><IdCard className="h-4 w-4 text-primary" /> Aadhaar: {profile.aadhaarMasked}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Phone: +91 {profile.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Email: {profile.email}</p>
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">Address & Ward Data</p>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start gap-2"><Home className="mt-0.5 h-4 w-4 text-primary" /> {profile.address}</p>
                  <p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Ward: {profile.ward}</p>
                  <p>Last updated: {new Date(profile.updatedAt).toLocaleString("en-IN")}</p>
                </div>
              </article>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-sm font-semibold text-muted-foreground">Upcoming Personal Reminders</p>
              <div className="grid gap-3 md:grid-cols-2">
                {profile.reminders.map((item) => (
                  <div key={item.reminderId} className="rounded-xl border border-border px-4 py-3 text-sm">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted-foreground">Due: {item.dueDate}</p>
                    <p className="text-muted-foreground">Status: {item.status}</p>
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
