"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface SidebarUserMenuProps {
  user: User;
  isCollapsed: boolean;
}

export function SidebarUserMenu({
  user,
  isCollapsed,
}: SidebarUserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isCollapsed) {
    // Collapsed state - icon only
    return (
      <div className="p-4 border-t border-white/10 mt-auto relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="w-full h-10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // Expanded state
  return (
    <div className="p-4 border-t border-white/10 mt-auto bg-white/5 relative z-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-blue-100 truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white transition-all"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
