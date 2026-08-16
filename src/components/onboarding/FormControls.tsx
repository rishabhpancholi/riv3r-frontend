import { AlertCircle } from "lucide-react";

const INPUT_BASE =
  "h-12 w-full rounded-lg border bg-white text-sm text-blue-950 outline-none transition placeholder:text-blue-300 focus:ring-2";

export function fieldClasses(hasError: boolean) {
  return `${INPUT_BASE} ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-blue-200 focus:border-sky-400 focus:ring-sky-200"
  }`;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-red-500">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}