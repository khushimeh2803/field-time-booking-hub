
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  DumbbellIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const location = useLocation();

  const items = [
    {
      title: "Sports",
      href: "/admin/sports",
      icon: DumbbellIcon
    },
    {
      title: "Grounds",
      href: "/admin/grounds",
      icon: Building2
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
      icon: Calendar
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  return (
    <nav
      className={cn(
        "flex flex-col space-x-2 lg:space-x-0 lg:space-y-1 p-4",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className="justify-start"
            asChild
          >
            <Link to={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
