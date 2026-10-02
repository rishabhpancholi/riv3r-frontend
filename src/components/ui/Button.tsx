import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
export const buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-55", { variants: { variant: { primary: "bg-primary text-white shadow-sm hover:bg-primary-dark", secondary: "border border-line bg-surface text-ink hover:border-primary/40 hover:bg-primary-soft/50", ghost: "text-muted hover:bg-surface-muted hover:text-ink", danger: "bg-danger text-white hover:bg-danger/90" } }, defaultVariants: { variant: "primary" } });
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export function Button({ className, variant, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant }), className)} {...props} />; }
