"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getMe, refreshSession, type User } from "@/lib/auth";
import { isUnauthorizedError } from "@/lib/axios";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import DashboardView from "@/components/dashboard/DashboardView";

const HEARTBEAT_INTERVAL_MS = 30 * 60 * 1000;

export default function SessionCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    async function heartbeat() {
      try {
        await getMe();
      } catch (error) {
        if (!isUnauthorizedError(error)) return;

        try {
          await refreshSession();
          await getMe();
        } catch {
          if (isActive) router.push("/login");
        }
      }
    }

    const intervalId = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [user, router]);

  if (checking) {
    return <Riv3rLoader />;
  }

  if (user) {
    return <DashboardView user={user} />;
  }

  return <>{children}</>;
}
