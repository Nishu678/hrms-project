import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CalendarClock,
  Building2,
  DollarSign,
  UserPlus,
  TrendingUp,
  User,
  Settings,
} from "lucide-react";
import { NavGroup } from "@/types/navigation";

export const navigationGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview and statistics",
        badge: 12,
      },
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
        description: "Manage employee records",
        roles: ["admin"],
        badge: 24,
      },
      {
        title: "Attendance",
        href: "/attendance",
        icon: CalendarDays,
        description: "Track attendance",
        badge: 3,
      },
      {
        title: "Leave Management",
        href: "/leave",
        icon: CalendarClock,
        description: "Leave requests & approvals",
        badge: 9,
      },
      {
        title: "Departments",
        href: "/departments",
        icon: Building2,
        description: "Organizational structure",
        roles: ["admin"],
        badge: 5,
      },
    ],
  },
  {
    title: "HR Operations",
    items: [
      {
        title: "Payroll",
        href: "/payroll",
        icon: DollarSign,
        description: "Salary management",
        roles: ["admin"],
      },
      {
        title: "Recruitment",
        href: "/recruitment",
        icon: UserPlus,
        description: "Job postings & applicants",
        roles: ["admin"],
      },
      {
        title: "Performance",
        href: "/performance",
        icon: TrendingUp,
        description: "Reviews & appraisals",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile",
        href: "/settings/profile",
        icon: User,
        description: "Personal settings",
      },
      {
        title: "Organization",
        href: "/settings/organization",
        icon: Settings,
        description: "Company settings",
        roles: ["admin"],
      },
    ],
  },
];
