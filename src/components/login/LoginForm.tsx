"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";

import { getErrorMessage } from "@/lib/axios";
import { login } from "@/lib/auth";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
const LOCKOUT_KEY = "riv3r_login_blocked_until";

function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCKOUT_KEY);
    if (!stored) return;

    const deadline = Number(stored);
    if (Number.isFinite(deadline) && deadline > Date.now()) {
      setBlockedUntil(deadline);
      setNow(Date.now());
    } else {
      window.localStorage.removeItem(LOCKOUT_KEY);
    }
  }, []);

  useEffect(() => {
    if (blockedUntil === null) return;

    const intervalId = setInterval(() => {
      const current = Date.now();
      if (current >= blockedUntil) {
        setBlockedUntil(null);
        setLoginAttempts(0);
        window.localStorage.removeItem(LOCKOUT_KEY);
      }
      setNow(current);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [blockedUntil]);

  const isBlocked = blockedUntil !== null && now < blockedUntil;
  const remaining = blockedUntil !== null ? formatRemaining(blockedUntil - now) : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    if (isBlocked) return;

    setIsSubmitting(true);
    try {
      const user = await login(values);
      showSuccessToast("Logged in successfully");
      router.push("/");
    } catch (error) {
      showErrorToast(getErrorMessage(error));

      const nextAttempts = loginAttempts + 1;
      if (nextAttempts >= MAX_ATTEMPTS) {
        const deadline = Date.now() + LOCKOUT_MS;
        window.localStorage.setItem(LOCKOUT_KEY, String(deadline));
        setBlockedUntil(deadline);
        setNow(Date.now());
        setLoginAttempts(0);
      } else {
        setLoginAttempts(nextAttempts);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 shadow-sm md:p-10">
      <h1 className="bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)]">
        RIV3R
      </h1>
      <p className="mt-2 text-center text-sm font-medium text-blue-900/60">
        Access your account and continue where you left off.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-blue-950">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              disabled={isBlocked}
              className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-blue-950 outline-none transition placeholder:text-blue-300 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                  : "border-blue-200 focus:border-sky-400 focus:ring-sky-200"
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-blue-950">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isBlocked}
              className={`h-12 w-full rounded-lg border bg-white py-3 pl-10 pr-12 text-sm text-blue-950 outline-none transition placeholder:text-blue-300 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                  : "border-blue-200 focus:border-sky-400 focus:ring-sky-200"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isBlocked}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {isBlocked && (
          <p className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Too many failed attempts. Try again in {remaining}.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isBlocked}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-blue-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          {isSubmitting ? "Logging in..." : isBlocked ? "Blocked" : "Log In"}
        </button>
      </form>
    </div>
  );
}
