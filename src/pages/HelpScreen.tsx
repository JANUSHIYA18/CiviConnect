import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, Headset, Mail } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { HelpItem } from "@/types/api";

const HelpScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<HelpItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ help: HelpItem[] }>("/me/help")
      .then((data) => setItems(data.help || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load help"));
  }, [user, navigate]);

  return (
    <KioskLayout title="Help Center" subtitle="Support & Guidance" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
                <Headset className="h-5 w-5 text-primary" />
                Contact Channels
              </h2>
              <p className="text-sm text-muted-foreground">Helpline: 1800-123-4545 (24x7) • Email: helpdesk@suvidhaone.in</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> Response SLA: 4 working hours
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article key={item.topic} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <CircleHelp className="h-5 w-5 text-primary" />
                    {item.topic}
                  </h3>
                  <p className="text-sm">{item.details}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{item.contact}</p>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default HelpScreen;
