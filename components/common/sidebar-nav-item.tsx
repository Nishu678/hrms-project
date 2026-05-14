"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NavItem } from "@/types/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({
  item,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) {
  const router = useRouter();
  const { setIsMobileOpen } = useSidebar();

  const handleClick = () => {
    router.push(item.href);
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

  if (isCollapsed) {
    // Collapsed state - icon only
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 mx-auto my-1.5 relative group z-10",
          isActive && "bg-white/20 text-white shadow-lg scale-105 border border-white/30"
        )}
        title={item.title}
        aria-label={item.title}
        aria-current={isActive ? "page" : undefined}
      >
        <item.icon className="w-5 h-5" />
        {item.badge && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white font-medium shadow-sm">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  // Expanded state - icon + text
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 mx-3 my-1.5 text-left relative group z-10",
        isActive && "bg-white/20 text-white shadow-lg border border-white/30"
      )}
      style={{ width: 'calc(100% - 24px)' }}
      aria-label={item.title}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      <span className="flex-1 truncate">{item.title}</span>
      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] text-white font-medium shadow-sm">
          {item.badge}
        </span>
      )}
    </button>
  );
}
