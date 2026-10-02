"use client";

import LoginForm from "./LoginForm";
import { Logo } from "@/components/ui/Logo";
import { CheckCircle2 } from "lucide-react";

export default function LoginScreen() {
  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[.9fr_1.1fr]">
      <section className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex xl:p-16"><Logo className="text-white" /><div className="max-w-lg"><p className="font-display text-5xl leading-tight italic">“The best work begins with clarity and trust.”</p><ul className="mt-10 space-y-4 text-sm text-white/75">{["One focused professional identity", "Verification-aware access", "Built for organizations and talent"].map((item) => <li key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-teal-300" />{item}</li>)}</ul></div><p className="text-sm text-white/50">Work, in motion.</p></section>
      <section className="flex min-h-screen flex-col px-4 py-5 sm:px-8 lg:px-12"><div className="lg:hidden"><Logo /></div><div className="flex flex-1 items-center justify-center py-10"><LoginForm /></div>
      </section>
    </main>
  );
}
