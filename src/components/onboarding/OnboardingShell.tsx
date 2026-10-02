import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { buttonVariants } from "@/components/ui/Button";

export default function OnboardingShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="min-h-screen bg-canvas"><header className="border-b border-line"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Logo /><Link href="/login" className={buttonVariants({variant:"ghost"})}>Save for later? <span className="font-bold text-primary">Log in</span></Link></div></header><div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><Link href="/onboarding" className={buttonVariants({variant:"ghost",className:"-ml-3"})}><ArrowLeft className="h-4 w-4" /> Change profile type</Link><div className="mt-7 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Step 2 of 2</p><div className="mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-surface-muted"><div className="h-full w-full rounded-full bg-primary" /></div><h1 className="mt-6 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p></div>{children}</div></main>;
}
