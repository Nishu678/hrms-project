"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data for display
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-muted-foreground">
          {user ? `Logged in as: ${user.email} (${user.role})` : "Loading..."}
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium text-card-foreground">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-card-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Employees", value: "0", icon: "👥", color: "bg-blue-500" },
          { title: "Present Today", value: "0", icon: "✅", color: "bg-green-500" },
          { title: "On Leave", value: "0", icon: "🏖️", color: "bg-yellow-500" },
          { title: "Departments", value: "0", icon: "🏢", color: "bg-purple-500" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-card rounded-xl shadow-sm border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Manage Employees", description: "Add, edit, or remove employee records", icon: "👤" },
            { title: "Attendance", description: "View and manage attendance records", icon: "📅" },
            { title: "Leave Requests", description: "Approve or reject leave requests", icon: "📝" },
          ].map((action) => (
            <div
              key={action.title}
              className="p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-semibold text-card-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
