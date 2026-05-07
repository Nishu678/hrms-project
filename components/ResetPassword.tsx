"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Icons
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Users,
  Shield,
} from "lucide-react";

// ─── Zod Schema ─────────────────────────────────────────────
const resetPasswordSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    otp: z
      .string()
      .min(1, "OTP is required")
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─── Reset Password API Function ─────────────────────────────
async function resetPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  return response.json();
}

// ─── Component ───────────────────────────────────────────────
const ResetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      setIsSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl border-0 py-0">
        <CardContent className="p-0 flex flex-col min-h-[600px]">
          {/* ══ HEADER ══ */}
          <div
            className="p-8 pb-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, var(--primary-hex) 100%)",
            }}
          >
            {/* bg circle */}
            <div className="absolute w-[250px] h-[250px] rounded-full -bottom-16 -right-16 bg-primary/10 pointer-events-none" />

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                HRMSphere
              </span>
            </div>

            {/* Title */}
            <div className="relative">
              <h1 className="text-white font-bold text-2xl mb-2">
                {isSuccess ? "Password Reset Successful!" : "Reset Password"}
              </h1>
              <p className="text-blue-100 text-sm">
                {isSuccess
                  ? "Your password has been successfully reset"
                  : "Enter your email, OTP, and new password"}
              </p>
            </div>
          </div>

          {/* ══ CONTENT ══ */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 py-6">
            {!isSuccess ? (
              <>
                {/* Error message */}
                {resetPasswordMutation.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">
                      {resetPasswordMutation.error.message}
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
                        disabled={resetPasswordMutation.isPending}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* OTP field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-sm font-semibold text-slate-700"
                    >
                      One-Time Password (OTP)
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        {...register("otp")}
                        className={`pl-10 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${errors.otp ? "border-red-300" : ""}`}
                        disabled={resetPasswordMutation.isPending}
                      />
                    </div>
                    {errors.otp && (
                      <p className="text-sm text-red-600">{errors.otp.message}</p>
                    )}
                  </div>

                  {/* New Password field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-semibold text-slate-700"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...register("newPassword")}
                        className={`pl-10 pr-10 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${errors.newPassword ? "border-red-300" : ""}`}
                        disabled={resetPasswordMutation.isPending}
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
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                        className={`pl-10 pr-10 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${errors.confirmPassword ? "border-red-300" : ""}`}
                        disabled={resetPasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all mt-4 disabled:opacity-70"
                  >
                    {resetPasswordMutation.isPending ? (
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
                        Resetting Password...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-slate-600 text-sm mb-2">
                  Your password has been successfully reset.
                </p>
                <p className="text-slate-500 text-xs">
                  Redirecting to login page...
                </p>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;