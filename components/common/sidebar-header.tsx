"use client";

import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  const { toggleCollapsed } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10 relative z-10">
      {!isCollapsed && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight block">
              HRMSphere
            </span>
            <span className="text-blue-100 text-xs">HR Management</span>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapsed}
        className={cn(
          "h-9 w-9 text-white/80 hover:bg-white/10 hover:text-white transition-all",
          isCollapsed && "mx-auto"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
