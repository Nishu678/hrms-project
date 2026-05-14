"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AppSidebar } from "@/components/common/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopHeader } from "@/components/layout/desktop-header";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface AdminLayoutWrapperProps {
  children: ReactNode;
  user: User;
}

function AdminLayoutContent({ children, user }: AdminLayoutWrapperProps) {
  const { toggleMobile, isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar user={user} />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          "lg:pl-[280px]",
          isCollapsed && "lg:pl-[64px]"
        )}
      >
        <MobileHeader onMenuClick={toggleMobile} user={user} />
        <DesktopHeader user={user} />

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayoutWrapper({
  children,
  user,
}: AdminLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AdminLayoutContent user={user}>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
