"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Icons
import { Mail, ArrowLeft, CheckCircle2, Users } from "lucide-react";

// ─── Zod Schema ─────────────────────────────────────────────
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── Forgot Password API Function ─────────────────────────────
async function forgotPassword(email: string) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to send OTP");
  }

  return response.json();
}

// ─── Component ───────────────────────────────────────────────
const ForgetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data.email),
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl border-0 py-0">
        <CardContent className="p-0 flex flex-col min-h-[500px]">
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
                {isSuccess ? "Check your email" : "Forgot Password?"}
              </h1>
              <p className="text-blue-100 text-sm">
                {isSuccess
                  ? "We've sent a 6-digit OTP to your email"
                  : "Enter your email to receive a password reset code"}
              </p>
            </div>
          </div>

          {/* ══ CONTENT ══ */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 py-6">
            {!isSuccess ? (
              <>
                {/* Error message */}
                {forgotPasswordMutation.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">
                      {forgotPasswordMutation.error.message}
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
                        disabled={forgotPasswordMutation.isPending}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all mt-4 disabled:opacity-70"
                  >
                    {forgotPasswordMutation.isPending ? (
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
                        Sending OTP...
                      </span>
                    ) : (
                      "Send Reset Code"
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
                  OTP sent successfully!
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Please check your email and enter the code on the next page
                </p>
                <Link href="/reset-password">
                  <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/30">
                    Continue to Reset Password
                  </Button>
                </Link>
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

export default ForgetPassword;
