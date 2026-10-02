import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { buttonVariants } from "./Button";
export function PageHeader() { return <header className="border-b border-line/80 bg-surface"><div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Logo /><nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2"><Link href="/login" className={buttonVariants({ variant: "ghost" })}>Log in</Link><Link href="/onboarding" className={buttonVariants({ variant: "primary", className: "bg-ink shadow-none hover:bg-primary-dark" })}>Get started <ArrowRight className="hidden h-4 w-4 sm:block" /></Link></nav></div></header>; }
