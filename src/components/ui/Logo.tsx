import Link from "next/link";
import { cn } from "@/lib/cn";
export function Logo({ className }: { className?: string }) { return <Link href="/" className={cn("inline-flex items-center font-bold tracking-[-0.04em] text-ink", className)} aria-label="RIV3R home"><span className="text-xl">RIV3R</span></Link>; }
