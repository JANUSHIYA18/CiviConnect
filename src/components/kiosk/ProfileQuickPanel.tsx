import { Bell, CircleUserRound, Download, FileClock, HelpCircle, ReceiptText, Settings, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: UserRound, label: "View Profile", route: "/profile" },
  { icon: ReceiptText, label: "Pending Bills", route: "/profile/pending-bills" },
  { icon: Bell, label: "Notifications", route: "/profile/notifications" },
  { icon: FileClock, label: "Reminders", route: "/profile/reminders" },
  { icon: Settings, label: "Settings", route: "/profile/settings" },
  { icon: HelpCircle, label: "Help", route: "/profile/help" },
  { icon: Download, label: "My Downloads", route: "/profile/downloads" },
];

const ProfileQuickPanel = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <CircleUserRound className="h-5 w-5" />
          <span className="sr-only">Profile menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
