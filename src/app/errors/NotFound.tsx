import { ArrowRight, Home, SearchX } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return <main className="flex min-h-screen flex-col bg-canvas"><header className="mx-auto flex h-18 w-full max-w-6xl items-center px-4 sm:px-6"><Logo /></header><section className="flex flex-1 items-center justify-center px-4 py-12"><Card className="w-full max-w-2xl overflow-hidden text-center"><div className="border-b border-line bg-primary-soft/60 p-8 sm:p-12"><SearchX className="mx-auto h-10 w-10 text-primary" /><p className="mt-5 font-display text-7xl italic text-primary">404</p></div><div className="p-7 sm:p-10"><h1 className="text-3xl font-semibold tracking-[-.04em]">This page has drifted away.</h1><p className="mx-auto mt-3 max-w-md leading-7 text-muted">The address may have changed, or the page may no longer exist. Let’s get you somewhere useful.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/" className={buttonVariants({variant:"primary"})}><Home className="h-4 w-4" /> Back home</Link><Link href="/login" className={buttonVariants({variant:"secondary"})}>Go to login <ArrowRight className="h-4 w-4" /></Link></div></div></Card></section></main>;
}
