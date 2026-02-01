import {
  LayoutDashboard,
  BookOpen,
  Award,
  Heart,
  CreditCard,
  Settings,
  UserCheck,
  ClipboardList,
  GraduationCap,
  Users,
  FilePlus,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import iskconLogo from "@/assets/iskcon-logo.png";
import aiheLogo from "@/assets/aihe-logo.png";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["user", "admin", "superadmin"] },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen, roles: ["user", "admin", "superadmin"] },
  { title: "Certificates", url: "/dashboard/certificates", icon: Award, roles: ["user", "admin", "superadmin"] },
  { title: "Donations", url: "/dashboard/donations", icon: Heart, roles: ["user", "admin", "superadmin"] },
  { title: "Transactions", url: "/dashboard/transactions", icon: CreditCard, roles: ["user", "admin", "superadmin"] },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, roles: ["user", "admin", "superadmin"] },
];

const adminItems: NavItem[] = [
  { title: "Student Approvals", url: "/dashboard/approvals", icon: UserCheck, roles: ["admin", "superadmin"] },
  { title: "Attendance Manager", url: "/dashboard/attendance", icon: ClipboardList, roles: ["admin", "superadmin"] },
  { title: "Gradebook", url: "/dashboard/gradebook", icon: GraduationCap, roles: ["admin", "superadmin"] },
];

const superAdminItems: NavItem[] = [
  { title: "User Management", url: "/dashboard/users", icon: Users, roles: ["superadmin"] },
  { title: "Course Creator", url: "/dashboard/course-creator", icon: FilePlus, roles: ["superadmin"] },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const { user, role, logout, setRole } = useAuth();
  const location = useLocation();

  const isActive = (url: string) => location.pathname === url;

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));
  const filteredAdminItems = adminItems.filter((item) => item.roles.includes(role));
  const filteredSuperAdminItems = superAdminItems.filter((item) => item.roles.includes(role));

  const getRoleBadgeVariant = (r: UserRole) => {
    switch (r) {
      case "superadmin":
        return "destructive";
      case "admin":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-2" onClick={handleNavClick}>
          <img src={iskconLogo} alt="ISKCON" className="h-8 w-auto" />
          <div className="w-px h-6 bg-sidebar-border" />
          <img src={aiheLogo} alt="AIHE" className="h-8 w-auto" />
        </NavLink>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-sidebar-foreground hover:bg-sidebar-accent">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Role Switcher */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2">
              Preview Role (Demo)
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-sidebar-foreground">
                <span className="text-sm font-medium capitalize">{role}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setRole("user")}>
                  <span>User</span>
                  <Badge variant="secondary" className="ml-auto">Default</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole("admin")}>
                  <span>Admin</span>
                  <Badge variant="default" className="ml-auto">Staff</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole("superadmin")}>
                  <span>SuperAdmin</span>
                  <Badge variant="destructive" className="ml-auto">Full</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
              Main
            </p>
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.url)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>

          {/* Admin Section */}
          {filteredAdminItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-sidebar-border">
              <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2 mt-2">
                Administration
              </p>
              {filteredAdminItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* SuperAdmin Section */}
          {filteredSuperAdminItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-sidebar-border">
              <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2 mt-2">
                System
              </p>
              {filteredSuperAdminItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-sidebar-accent">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <Badge variant={getRoleBadgeVariant(role)} className="text-xs mt-0.5">
                {role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
