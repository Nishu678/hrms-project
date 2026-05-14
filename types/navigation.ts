import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  description?: string;
  roles?: ('admin' | 'employee')[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
}
