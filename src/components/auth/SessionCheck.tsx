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
  const [isExpired, setIsExpired] = useState(false);

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

    async function refreshUser() {
      try {
        const freshUser = await getMe();
        if (isActive) setUser(freshUser);
      } catch (error) {
        if (!isUnauthorizedError(error)) return;

        try {
          await refreshSession();
          const freshUser = await getMe();
          if (isActive) setUser(freshUser);
        } catch {
          if (isActive) {
            setIsExpired(true);
            router.push("/login");
          }
        }
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") refreshUser();
    }

    const intervalId = setInterval(refreshUser, HEARTBEAT_INTERVAL_MS);
    window.addEventListener("focus", refreshUser);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isActive = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", refreshUser);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, router]);

  if (isExpired) {
    return <Riv3rLoader />;
  }

  if (checking) {
    return <Riv3rLoader />;
  }

  if (user) {
    return <DashboardView user={user} />;
  }

  return <>{children}</>;
}
