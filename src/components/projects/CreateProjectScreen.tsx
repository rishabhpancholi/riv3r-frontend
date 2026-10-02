"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { useProtectedUser } from "@/components/auth/useProtectedUser";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import AppShell from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default function CreateProjectScreen() {
  const { user, error } = useProtectedUser();
  if (error) return <main className="grid min-h-screen place-items-center bg-canvas px-4"><Card className="max-w-md p-7 text-center"><h1 className="text-xl font-semibold">We couldn’t load this page.</h1><p className="mt-2 text-sm leading-6 text-muted">{error}</p></Card></main>;
  if (!user) return <Riv3rLoader />;
  return <AppShell user={user} activePath="/projects"><Link href="/projects" className={buttonVariants({variant:"ghost",className:"-ml-3"})}><ArrowLeft className="h-4 w-4" /> Back to projects</Link><Card className="mt-6 max-w-3xl p-7 sm:p-10"><div className="grid h-12 w-12 place-items-center rounded-xl bg-warning-soft text-warning"><Construction className="h-6 w-6" /></div><p className="mt-7 text-sm font-semibold uppercase tracking-[.14em] text-primary">Project setup</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Create a project</h1><p className="mt-4 max-w-xl leading-7 text-muted">Project creation is being prepared. This page is ready for the form and backend contract when they become available.</p></Card></AppShell>;
}
