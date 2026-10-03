"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";
import { getMe, refreshSession } from "@/lib/auth";
import { isUnauthorizedError } from "@/lib/axios";

const SESSION_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

interface SessionContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    async function refreshUser() {
      try {
        const freshUser = await getMe();
        if (active) setUser(freshUser);
      } catch (error) {
        if (!isUnauthorizedError(error)) return;
        try {
          await refreshSession();
          const freshUser = await getMe();
          if (active) setUser(freshUser);
        } catch {
          if (active) {
            setUser(null);
            router.replace("/login");
          }
        }
      }
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void refreshUser();
    }
    const intervalId = window.setInterval(refreshUser, SESSION_REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshUser);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshUser);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, user]);

  const value = useMemo(() => ({ user, setUser }), [user]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
