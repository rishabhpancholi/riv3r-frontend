"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  XCircle,
} from "lucide-react";

import { PASSWORD_RULES } from "@/lib/schemas";

interface PasswordFieldProps {
  id: string;
  register: UseFormRegisterReturn;
  value: string;
  error?: string;
}

export default function PasswordField({
  id,
  register,
  value,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        Password <span className="text-danger">*</span>
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a strong password"
          aria-invalid={!!error}
          className={`h-11 w-full rounded-xl border bg-surface pl-10 pr-12 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:ring-4 ${
            error
              ? "border-danger focus:border-danger focus:ring-danger/10"
              : "border-line focus:border-primary focus:ring-primary/10"
          }`}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-surface-muted hover:text-ink"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {value && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface-muted/60 p-3">
          <p className="text-xs font-semibold text-ink">
            Password must include:
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {PASSWORD_RULES.map((rule) => {
              const satisfied = rule.test(value);
              return (
                <li key={rule.key} className="flex items-center gap-2 text-sm">
                  {satisfied ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-muted" />
                  )}
                  <span
                    className={satisfied ? "text-accent" : "text-muted"}
                  >
                    {rule.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1 flex items-center gap-1.5 text-sm font-medium text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
