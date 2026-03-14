import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SIDEBAR_RAIL_WIDTH = 64;

export function DashboardLayout() {
  const { isLoggedIn, isLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Check localStorage as fallback if context hasn't updated yet
  const hasToken = typeof window !== "undefined" ? !!localStorage.getItem("auth_token") : false;
  const effectiveIsLoggedIn = isLoggedIn || hasToken;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not logged in (only after loading is complete)
  if (!effectiveIsLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex">
      {/* Backdrop when sidebar expanded (click to collapse) */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarExpanded(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <AppSidebar
        expanded={sidebarExpanded}
        onExpand={() => setSidebarExpanded(true)}
        onCollapse={() => setSidebarExpanded(false)}
        onToggle={() => setSidebarExpanded((v) => !v)}
      />

      {/* Main content area */}
      <div
        className="min-h-screen flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: SIDEBAR_RAIL_WIDTH,
          width: `calc(100vw - ${SIDEBAR_RAIL_WIDTH}px)`,
        }}
      >
        {/* Top Header — no logo here, it lives in the sidebar */}
        <header className="h-14 flex items-center border-b border-border px-6 bg-background sticky top-0 z-30 shrink-0">
          <h1 className="text-lg font-semibold text-foreground font-poppins">
            AIHE Learning Portal
          </h1>
        </header>

        <main className="p-4 md:p-6 flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
