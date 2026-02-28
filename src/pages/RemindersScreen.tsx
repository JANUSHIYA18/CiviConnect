import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlarmClockCheck, CalendarClock } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ProfileReminder } from "@/types/api";

const RemindersScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<ProfileReminder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ reminders: ProfileReminder[] }>("/me/reminders")
      .then((data) => setItems(data.reminders || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load reminders"));
  }, [user, navigate]);

  return (
    <KioskLayout title="Reminders" subtitle="Upcoming Actions" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Upcoming reminders</p>
                <p className="text-3xl font-bold">{items.filter((item) => item.status !== "completed").length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Completed reminders</p>
                <p className="text-3xl font-bold">{items.filter((item) => item.status === "completed").length}</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article key={item.reminderId} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <AlarmClockCheck className="h-5 w-5 text-primary" />
                    {item.title}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" /> Due date: {item.dueDate}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Status: {item.status}</p>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default RemindersScreen;
