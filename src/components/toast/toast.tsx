"use client";

import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ToastContentProps {
  message: string;
  onClose: () => void;
}

export function SuccessToast({ message, onClose }: ToastContentProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white/95 p-4 shadow-lg shadow-emerald-500/5 backdrop-blur">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
      <p className="flex-1 text-sm font-medium leading-snug text-emerald-950">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-zinc-400 transition hover:text-zinc-600"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ErrorToast({ message, onClose }: ToastContentProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-white/95 p-4 shadow-lg shadow-red-500/5 backdrop-blur">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="flex-1 text-sm font-medium leading-snug text-red-950">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-zinc-400 transition hover:text-zinc-600"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function showSuccessToast(message: string, duration = 4000) {
  toast.custom(
    (t) => <SuccessToast message={message} onClose={() => toast.dismiss(t.id)} />,
    { duration }
  );
}

export function showErrorToast(message: string, duration = 5000) {
  toast.custom(
    (t) => <ErrorToast message={message} onClose={() => toast.dismiss(t.id)} />,
    { duration }
  );
}
