import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Clock3 } from "lucide-react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { NotificationItem } from "@/types/api";

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    apiRequest<{ notifications: NotificationItem[] }>("/me/notifications")
      .then((data) => setItems(data.notifications || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load notifications"));
  }, [user, navigate]);

  return (
    <KioskLayout title="Notifications" subtitle="Recent Alerts & Updates" showLogout>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Button variant="kioskOutline" onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        {!error && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Total notifications</p>
                <p className="text-3xl font-bold">{items.length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-3xl font-bold">{items.filter((item) => !item.read).length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-3xl font-bold">{items.filter((item) => item.read).length}</p>
              </div>
            </section>

            <section className="space-y-4">
              {items.map((item) => (
                <article key={item.notificationId} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Bell className="h-5 w-5 text-primary" />
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.read ? "Read" : "New"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-4 w-4" /> {item.createdAtLabel}
                  </p>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default NotificationsScreen;
