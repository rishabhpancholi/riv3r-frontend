"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getMe, refreshSession } from "@/lib/auth";
import { isUnauthorizedError } from "@/lib/axios";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import DashboardView from "@/components/dashboard/DashboardView";
import { useSession } from "@/components/auth/SessionProvider";

export default function SessionCheck({ children }: { children: ReactNode }) {
  const { user, setUser } = useSession();
  const [checking, setChecking] = useState(user === null);

  useEffect(() => {
    if (user) return;
    let isActive = true;

    async function checkSession() {
      try {
        const currentUser = await getMe();
        if (isActive) setUser(currentUser);
      } catch (error) {
        if (!isUnauthorizedError(error)) return;

        try {
          await refreshSession();
          const currentUser = await getMe();
          if (isActive) setUser(currentUser);
        } catch {
          // tokens missing or both expired — stay on the landing page
        }
      } finally {
        if (isActive) setChecking(false);
      }
    }

    checkSession();

    return () => {
      isActive = false;
    };
  }, [setUser, user]);

  if (checking) {
    return <Riv3rLoader />;
  }

  if (user) {
    return <DashboardView user={user} />;
  }

  return <>{children}</>;
}
