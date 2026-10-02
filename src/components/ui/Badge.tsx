import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", { variants: { tone: { neutral: "bg-surface-muted text-muted", primary: "bg-primary-soft text-primary-dark", success: "bg-accent-soft text-accent", warning: "bg-warning-soft text-warning", danger: "bg-danger-soft text-danger" } }, defaultVariants: { tone: "neutral" } });
type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;
export function Badge({ className, tone, ...props }: BadgeProps) { return <span className={cn(badgeVariants({ tone }), className)} {...props} />; }
