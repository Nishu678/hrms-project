"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { navigationGroups } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface AppSidebarProps {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden",
          // Desktop width
          "lg:w-[280px]",
          isCollapsed && "lg:w-[64px]",
          // Mobile behavior
          "w-[280px] -translate-x-full lg:translate-x-0",
          isMobileOpen && "translate-x-0"
        )}
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #006394 100%)"
        }}
        aria-label="Main navigation"
      >
        {/* Decorative circle */}
        <div className="absolute w-[280px] h-[280px] rounded-full -bottom-40 -right-40 bg-primary/10 pointer-events-none overflow-hidden" />

        <SidebarHeader isCollapsed={isCollapsed} />

        <SidebarNav
          groups={navigationGroups}
          isCollapsed={isCollapsed}
          userRole={user?.role ?? undefined}
        />

        <SidebarUserMenu user={user || {}} isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}
