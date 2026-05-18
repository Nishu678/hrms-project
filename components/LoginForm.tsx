"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Icons
import {
  Eye,
  EyeOff,
  Mail,
  Shield,
  Globe,
  Zap,
  Users,
  CalendarDays,
  Briefcase,
} from "lucide-react";

// ─── Zod Schema ─────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Login API Function ─────────────────────────────────────
async function login(credentials: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for cookies! allows browser to send cookies with the request and receive them in the response.
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Login failed");
  }

  return response.json();
}

// ─── Static Data ────────────────────────────────────────────
const trustItems = [
  { icon: Shield, label: "SOC 2 Certified" },
  { icon: Globe, label: "GDPR Ready" },
  { icon: Zap, label: "99.9% Uptime" },
];

// ─── Component ───────────────────────────────────────────────
const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  // Login mutation with TanStack Query
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (data) => {
      // Token is now stored in HTTP-only cookie - no client storage needed!
      // Only employees should be forced to change password on first login
      if (data.user.isFirstLogin && data.user.role === "employee") {
        router.push("/change-password");
      } else {
        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border-0 py-0">
        <CardContent className="p-0 flex flex-col lg:flex-row min-h-[700px]">
          {/* ══ LEFT PANEL ══ */}
          <div
            className="hidden lg:flex flex-col w-[45%] shrink-0 p-12 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, var(--primary-hex) 100%)",
            }}
          >
            {/* bg circle */}
            <div className="absolute w-[450px] h-[450px] rounded-full -bottom-32 -right-32 bg-primary/10 pointer-events-none" />

            {/* Logo */}
            <div className="flex items-center gap-3 mb-auto">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                HRMSphere
              </span>
            </div>

            {/* Hero content */}
            <div className="flex-1 flex flex-col justify-center py-12">
              <div className="mb-8">
                <h2 className="text-white font-bold text-3xl leading-tight mb-4">
                  Modern HR Management
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Streamline your HR operations with our powerful, intuitive
                  platform.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                {[
                  { icon: Users, text: "Manage employees efficiently" },
                  { icon: CalendarDays, text: "Track attendance & leave" },
                  { icon: Briefcase, text: "Simplify payroll process" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-blue-50 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 pt-6 border-t border-white/10">
              {trustItems.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12 sm:px-12">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-900 font-bold text-xl">
                  HRMSphere
                </span>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome back
                </h1>
                <p className="text-slate-600">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Error message */}
              {loginMutation.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">
                    {loginMutation.error.message}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      {...register("email")}
                      className={`pl-10 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${errors.email ? "border-red-300" : ""}`}
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...register("password")}
                      className={`pr-10 pl-4 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${errors.password ? "border-red-300" : ""}`}
                      disabled={loginMutation.isPending}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me + Forgot */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked as boolean)
                      }
                      className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm text-slate-600 font-medium cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forget-password"
                    className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all mt-4 disabled:opacity-70"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-primary font-semibold hover:text-primary/80 hover:underline"
                >
                  Contact your admin
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
