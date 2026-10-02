import Link from "next/link";
import { ArrowLeft, ShieldX } from "lucide-react";
import type { User } from "@/lib/auth";
import AppShell from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default function AccessDenied({ user }: { user: User }) {
  return <AppShell user={user} activePath="/projects"><Card className="mx-auto max-w-2xl p-7 text-center sm:p-10"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger-soft text-danger"><ShieldX className="h-7 w-7" /></div><p className="mt-6 text-sm font-semibold uppercase tracking-[.14em] text-danger">403 · Access denied</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Projects aren’t available for this account.</h1><p className="mx-auto mt-4 max-w-lg leading-7 text-muted">Your current account does not have permission to view this area. Project access is currently available only to approved client accounts.</p><Link href="/" className={buttonVariants({variant:"primary",className:"mt-7"})}><ArrowLeft className="h-4 w-4" /> Return to Dashboard</Link></Card></AppShell>;
}
