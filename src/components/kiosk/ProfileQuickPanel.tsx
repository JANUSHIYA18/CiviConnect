import { Bell, CircleUserRound, Download, FileClock, HelpCircle, ReceiptText, Settings, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileQuickPanel = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const menuItems = [
    { icon: UserRound, label: t("menu_view_profile"), route: "/profile" },
    { icon: ReceiptText, label: t("menu_pending_bills"), route: "/profile/pending-bills" },
    { icon: Bell, label: t("menu_notifications"), route: "/profile/notifications" },
    { icon: FileClock, label: t("menu_reminders"), route: "/profile/reminders" },
    { icon: Settings, label: t("menu_settings"), route: "/profile/settings" },
    { icon: HelpCircle, label: t("menu_help"), route: "/profile/help" },
    { icon: Download, label: t("menu_downloads"), route: "/profile/downloads" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <CircleUserRound className="h-5 w-5" />
          <span className="sr-only">{t("menu_profile")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>{t("menu_my_account")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.route} onClick={() => navigate(item.route)} className="gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileQuickPanel;
