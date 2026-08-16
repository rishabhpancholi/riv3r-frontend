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
      <label htmlFor={id} className="text-sm font-semibold text-blue-950">
        Password <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a strong password"
          className={`h-12 w-full rounded-lg border bg-white py-3 pl-10 pr-12 text-sm text-blue-950 outline-none transition placeholder:text-blue-300 focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-blue-200 focus:border-sky-400 focus:ring-sky-200"
          }`}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 transition hover:text-blue-600"
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
        <div className="flex flex-col gap-2 rounded-lg border border-blue-200 bg-white/70 p-4">
          <p className="text-xs font-semibold text-blue-950">
            Password must include:
          </p>
          <ul className="flex flex-col gap-1.5">
            {PASSWORD_RULES.map((rule) => {
              const satisfied = rule.test(value);
              return (
                <li key={rule.key} className="flex items-center gap-2 text-sm">
                  {satisfied ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                  )}
                  <span
                    className={satisfied ? "text-emerald-700" : "text-red-600"}
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
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}