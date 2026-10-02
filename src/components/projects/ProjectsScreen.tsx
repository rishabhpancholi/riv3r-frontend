"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { useProtectedUser } from "@/components/auth/useProtectedUser";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import AppShell from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default function ProjectsScreen() {
  const { user, error } = useProtectedUser();
  if (error) return <main className="grid min-h-screen place-items-center bg-canvas px-4"><Card className="max-w-md p-7 text-center"><h1 className="text-xl font-semibold">We couldn’t load your projects.</h1><p className="mt-2 text-sm leading-6 text-muted">{error}</p><button onClick={() => window.location.reload()} className={buttonVariants({variant:"secondary",className:"mt-6"})}>Try again</button></Card></main>;
  if (!user) return <Riv3rLoader />;

  return <AppShell user={user} activePath="/projects"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Workspace</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Projects</h1><p className="mt-3 text-muted">Create and manage your work in one focused place.</p></div><Link href="/projects/create" className={buttonVariants({variant:"primary",className:"min-h-12 px-6"})}><Plus className="h-4 w-4" /> Create project</Link></div><Card className="mt-8 flex min-h-80 flex-col items-center justify-center p-7 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary"><FolderKanban className="h-7 w-7" /></div><h2 className="mt-6 text-2xl font-semibold tracking-[-.03em]">No projects yet</h2><p className="mt-3 max-w-md leading-7 text-muted">Your projects will appear here. Start by creating the workspace for your first engagement.</p><Link href="/projects/create" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">Create your first project <ArrowRight className="h-4 w-4" /></Link></Card></AppShell>;
}
