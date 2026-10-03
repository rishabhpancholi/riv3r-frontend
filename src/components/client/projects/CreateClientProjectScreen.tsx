"use client";

import { useProtectedUser } from "@/components/auth/useProtectedUser";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import AccessDenied from "@/components/auth/AccessDenied";
import AppShell from "@/components/dashboard/AppShell";
import { Card } from "@/components/ui/Card";
import { canAccessRoute, PROJECT_CREATE_POLICY } from "@/lib/access-control";

export default function CreateClientProjectScreen() {
  const { user, error } = useProtectedUser();
  if (error) return <main className="grid min-h-screen place-items-center bg-canvas px-4"><Card className="max-w-md p-7 text-center"><h1 className="text-xl font-semibold">We couldn’t load this page.</h1><p className="mt-2 text-sm leading-6 text-muted">{error}</p></Card></main>;
  if (!user) return <Riv3rLoader />;
  if (!canAccessRoute(user, PROJECT_CREATE_POLICY)) return <AccessDenied user={user} />;

  return <AppShell user={user} activePath="/client/projects"><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Create project</h1></AppShell>;
}
