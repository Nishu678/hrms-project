"use client";

import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface DesktopHeaderProps {
  user: User;
}

export function DesktopHeader({ user }: DesktopHeaderProps) {
  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shadow-sm">
      {/* Left side - Breadcrumb/Title */}
      <div className="flex items-center gap-4 flex-1">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground truncate">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search employees, departments..."
            className={cn(
              "h-10 w-72 rounded-lg border border-input bg-background pl-10 pr-4",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-all hover:border-primary/50",
              "shadow-sm"
            )}
          />
        </div>

        {/* Divider */}
        <div className="hidden xl:block h-8 w-px bg-border" />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 hover:bg-accent transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:bg-accent transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Divider */}
        <div className="h-8 w-px bg-border mx-1" />

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role || "Employee"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <span className="text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
