import { ArrowRight, Building2, Check, UserRound } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Choose your profile" };

const roles = [
  { href: "/onboarding/organization", icon: Building2, eyebrow: "For teams", title: "I represent an organization", copy: "Create a trusted company presence and prepare to connect with independent professionals.", points: ["Organization profile", "Verified owner account"] },
  { href: "/onboarding/resource", icon: UserRound, eyebrow: "For talent", title: "I’m an independent professional", copy: "Present your skills, experience, and portfolio through one clear professional profile.", points: ["Professional profile", "Skills and portfolio"] },
];

export default function Onboarding() {
  return <main className="min-h-screen bg-canvas"><header className="border-b border-line"><div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6"><Logo /><Link href="/login" className={buttonVariants({ variant: "ghost" })}>Already registered? <span className="font-bold text-primary">Log in</span></Link></div></header>
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Step 1 of 2</p><div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-surface-muted"><div className="h-full w-1/2 rounded-full bg-primary" /></div><h1 className="mt-7 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">How will you use RIV3R?</h1><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted">Choose the path that best describes you. You can review the details before creating your profile.</p></div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">{roles.map(({href,icon:Icon,eyebrow,title,copy,points}) => <Card key={href} className="group flex flex-col p-6 transition hover:-translate-y-1 hover:border-primary/30 sm:p-8"><div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-6 w-6" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-primary">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">{title}</h2><p className="mt-3 leading-7 text-muted">{copy}</p><ul className="mt-6 space-y-3">{points.map(point => <li key={point} className="flex items-center gap-3 text-sm font-medium"><span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-accent"><Check className="h-3.5 w-3.5" /></span>{point}</li>)}</ul><Link href={href} className={buttonVariants({ variant: "secondary", className: "mt-8 w-full justify-between group-hover:border-primary/50" })}>Continue <ArrowRight className="h-4 w-4" /></Link></Card>)}</div>
      <p className="mt-8 text-center text-sm text-muted">Not sure which to choose? Organizations hire or manage work; professionals offer their individual expertise.</p>
    </section></main>;
}
