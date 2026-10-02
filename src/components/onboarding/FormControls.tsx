import { AlertCircle } from "lucide-react";

const INPUT_BASE =
  "h-11 w-full rounded-xl border bg-surface text-sm text-ink outline-none transition placeholder:text-muted/60 focus:ring-4";

export function fieldClasses(hasError: boolean) {
  return `${INPUT_BASE} ${
    hasError
      ? "border-danger focus:border-danger focus:ring-danger/10"
      : "border-line focus:border-primary focus:ring-primary/10"
  }`;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 flex items-center gap-1.5 text-sm font-medium text-danger">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}
