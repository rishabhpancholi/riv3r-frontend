"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowUpRight, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";

import { getErrorMessage } from "@/lib/axios";
import { login } from "@/lib/auth";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";
import Riv3rLoader from "@/components/auth/Riv3rLoader";

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
  const [isRedirecting, setIsRedirecting] = useState(false);
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
      setIsRedirecting(true);
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

  if (isRedirecting) {
    return <Riv3rLoader />;
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Welcome back</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-.045em] text-ink">Log in to RIV3R</h1>
      <p className="mt-3 text-base leading-7 text-muted">Access your profile and continue where you left off.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              disabled={isBlocked}
              aria-invalid={!!errors.email}
              className={`h-12 w-full rounded-xl border bg-surface pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.email
                  ? "border-danger focus:border-danger focus:ring-danger/10"
                  : "border-line focus:border-primary focus:ring-primary/10"
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isBlocked}
              aria-invalid={!!errors.password}
              className={`h-12 w-full rounded-xl border bg-surface py-3 pl-11 pr-12 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.password
                  ? "border-danger focus:border-danger focus:ring-danger/10"
                  : "border-line focus:border-primary focus:ring-primary/10"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isBlocked}
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {isBlocked && (
          <p role="alert" aria-live="polite" className="flex items-center justify-center gap-1.5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-center text-sm font-medium text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Too many failed attempts. Try again in {remaining}.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isBlocked}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          {isSubmitting ? "Logging in..." : isBlocked ? "Blocked" : "Log In"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        New to RIV3R?{" "}
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1 font-semibold text-primary transition hover:text-primary-dark hover:underline"
        >
          Let&apos;s onboard
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </p>
    </div>
  );
}
