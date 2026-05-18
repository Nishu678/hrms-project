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
import { Label } from "@/components/ui/label";

// Icons
import { Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from "lucide-react";

// ─── Zod Schema ─────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// ─── Change Password API Function ─────────────────────────────
async function changePassword(passwords: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Password change failed");
  }

  return response.json();
}

// ─── Component ───────────────────────────────────────────────
const ChangePassword = () => {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Change password mutation with TanStack Query
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormValues) => changePassword(data),
    onSuccess: () => {
      // Password changed successfully, redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl border-0 py-0">
        <CardContent className="p-0">
          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12 sm:px-12">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Change Your Password
                </h1>
                <p className="text-slate-600">
                  For your security, you must change your password on first
                  login
                </p>
              </div>

              {/* Info banner */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">First time login?</p>
                  <p className="text-blue-700">
                    Please use the temporary password sent to your email and
                    create a new secure password.
                  </p>
                </div>
              </div>

              {/* Error message */}
              {changePasswordMutation.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">
                    {changePasswordMutation.error.message}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Current Password field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      {...register("currentPassword")}
                      className={`pr-10 pl-10 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${
                        errors.currentPassword ? "border-red-300" : ""
                      }`}
                      disabled={changePasswordMutation.isPending}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
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
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      {...register("newPassword")}
                      className={`pr-10 pl-10 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${
                        errors.newPassword ? "border-red-300" : ""
                      }`}
                      disabled={changePasswordMutation.isPending}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? (
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
                      className={`pr-10 pl-10 h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary ${
                        errors.confirmPassword ? "border-red-300" : ""
                      }`}
                      disabled={changePasswordMutation.isPending}
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
                  disabled={changePasswordMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all mt-4 disabled:opacity-70"
                >
                  {changePasswordMutation.isPending ? (
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
                      Changing password...
                    </span>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>

              {/* Footer note */}
              <p className="text-center text-xs text-slate-500 mt-6">
                After changing your password, you will be redirected to the
                dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
