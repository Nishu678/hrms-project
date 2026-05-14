"use client";

import { usePathname } from "next/navigation";
import { NavGroup } from "@/types/navigation";
import { SidebarNavItem } from "./sidebar-nav-item";
import { Separator } from "@/components/ui/separator";

interface SidebarNavProps {
  groups: NavGroup[];
  isCollapsed: boolean;
  userRole?: string;
}

export function SidebarNav({ groups, isCollapsed, userRole }: SidebarNavProps) {
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredGroups = groups.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || item.roles.includes(userRole as any)
    ),
  }));

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
      {filteredGroups.map((group, groupIndex) => {
        // Skip groups with no items after filtering
        if (group.items.length === 0) return null;

        return (
          <div key={group.title}>
            {!isCollapsed && (
              <div className="px-4 mb-2 mt-4 relative z-10">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
            )}
            {group.items.map((item) => {
              // Determine if this item is active
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              );
            })}
            {groupIndex < filteredGroups.length - 1 && !isCollapsed && (
              <Separator className="my-4 mx-2 bg-white/10" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
