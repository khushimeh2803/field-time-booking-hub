
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  DumbbellIcon,
  LayoutDashboard,
  MessageSquare,
  Tag,
  BarChart,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const location = useLocation();

  const items = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
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
      title: "Promo Codes",
      href: "/admin/promo-codes",
      icon: Tag
    },
    {
      title: "Membership Plans",
      href: "/admin/membership-plans",
      icon: BarChart
    },
    {
      title: "User Memberships",
      href: "/admin/user-memberships",
      icon: Users
    },
    {
      title: "Feedback",
      href: "/admin/feedback",
      icon: MessageSquare
    },
    {
      title: "Contact Submissions",
      href: "/admin/contact-submissions",
      icon: Mail
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
        "flex flex-col space-x-2 lg:space-x-0 lg:space-y-1 p-4 min-h-screen bg-white shadow-md w-64",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center p-4 mb-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className="justify-start mb-1"
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
