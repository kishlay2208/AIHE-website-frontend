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
  Video,
  LogOut,
  ChevronDown,
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

const RAIL_WIDTH = 64;
const EXPANDED_WIDTH = 260;

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
  { title: "Instructor Manager", url: "/dashboard/instructors", icon: GraduationCap, roles: ["superadmin"] },
  { title: "Course Creator", url: "/dashboard/course-creator", icon: FilePlus, roles: ["superadmin"] },
  { title: "Media Manager", url: "/dashboard/media-manager", icon: Video, roles: ["superadmin"] },
];

interface AppSidebarProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onToggle: () => void;
}

export function AppSidebar({ expanded, onExpand, onCollapse }: AppSidebarProps) {
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
    onCollapse();
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  const renderNavItem = (item: NavItem) => (
    <NavLink
      key={item.title}
      to={item.url}
      onClick={handleNavClick}
      title={!expanded ? item.title : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
        isActive(item.url)
          ? "bg-white/15 text-white"
          : "text-white/65 hover:bg-white/10 hover:text-white"
      )}
    >
      {isActive(item.url) && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
      )}
      <item.icon className="h-5 w-5 shrink-0" />
      {expanded && (
        <span className="truncate whitespace-nowrap">{item.title}</span>
      )}
    </NavLink>
  );

  return (
    <div
      className="fixed top-0 left-0 z-50 h-full overflow-hidden transition-[width] duration-300 ease-in-out shadow-xl"
      style={{
        width: expanded ? EXPANDED_WIDTH : RAIL_WIDTH,
        background: "linear-gradient(180deg, #1e2340 0%, #161b30 100%)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={onExpand}
      onMouseLeave={onCollapse}
    >
      <aside className="flex h-full w-full min-w-0 flex-col">

        {/* Logo Section */}
        <div
          className="flex shrink-0 items-center border-b"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            height: 64,
            padding: expanded ? "0 16px" : "0 12px",
            justifyContent: expanded ? "flex-start" : "center",
            overflow: "hidden",
          }}
        >
          {expanded ? (
            <NavLink to="/" className="flex items-center gap-2.5" onClick={handleNavClick}>
              <img src={iskconLogo} alt="ISKCON" className="h-9 w-auto shrink-0" />
              <div className="h-6 w-px shrink-0 bg-white/20" />
              <img src={aiheLogo} alt="AIHE" className="h-9 w-auto shrink-0" />
            </NavLink>
          ) : (
            <NavLink to="/" onClick={handleNavClick} className="flex items-center justify-center gap-1">
              <img src={iskconLogo} alt="ISKCON" className="h-7 w-auto shrink-0" />
            </NavLink>
          )}
        </div>

        {/* Nav Items */}
        <ScrollArea className="flex-1 py-3">
          <div className={cn("flex flex-col gap-0.5", expanded ? "px-3" : "px-2")}>

            {/* Main Nav */}
            {filteredNavItems.map(renderNavItem)}

            {/* Admin Section */}
            {filteredAdminItems.length > 0 && (
              <>
                <div
                  className="my-2 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                />
                {expanded && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    Administration
                  </p>
                )}
                {filteredAdminItems.map(renderNavItem)}
              </>
            )}

            {/* Super Admin Section */}
            {filteredSuperAdminItems.length > 0 && (
              <>
                <div
                  className="my-2 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                />
                {expanded && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    System
                  </p>
                )}
                {filteredSuperAdminItems.map(renderNavItem)}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Role Switcher (only when expanded) */}
        {expanded && (
          <div
            className="shrink-0 border-t px-3 py-3"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Preview Role
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10">
                <span className="capitalize">{role}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
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
        )}

        {/* User Footer */}
        <div
          className="shrink-0 border-t p-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {user ? (
            <div className={cn("flex items-center gap-3", !expanded && "justify-center")}>
              <Avatar className="h-9 w-9 shrink-0 border-2" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                <AvatarFallback className="text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <Badge variant={getRoleBadgeVariant(role)} className="mt-0.5 text-[10px] px-1.5 py-0">
                      {role}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="shrink-0 text-white/50 hover:bg-white/10 hover:text-white"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            !expanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="mx-auto flex text-white/50 hover:bg-white/10 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )
          )}
        </div>
      </aside>
    </div>
  );
}
