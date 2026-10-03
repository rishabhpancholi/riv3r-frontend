"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useProtectedUser } from "@/components/auth/useProtectedUser";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import AccessDenied from "@/components/auth/AccessDenied";
import AppShell from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { canAccessRoute, hasPermission, PROJECTS_POLICY } from "@/lib/access-control";

export default function ClientProjectsScreen() {
  const { user, error } = useProtectedUser();
  if (error) return <main className="grid min-h-screen place-items-center bg-canvas px-4"><Card className="max-w-md p-7 text-center"><h1 className="text-xl font-semibold">We couldn’t load your projects.</h1><p className="mt-2 text-sm leading-6 text-muted">{error}</p><button onClick={() => window.location.reload()} className={buttonVariants({variant:"secondary",className:"mt-6"})}>Try again</button></Card></main>;
  if (!user) return <Riv3rLoader />;
  if (!canAccessRoute(user, PROJECTS_POLICY)) return <AccessDenied user={user} />;
  const canCreate = hasPermission(user, "projects.create");

  return <AppShell user={user} activePath="/client/projects"><div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Projects</h1>{canCreate && <Link href="/client/projects/create" className={buttonVariants({variant:"primary",className:"min-h-12 px-6"})}><Plus className="h-4 w-4" /> Create project</Link>}</div></AppShell>;
}
