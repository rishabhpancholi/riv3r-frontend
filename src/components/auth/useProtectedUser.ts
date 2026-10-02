"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, refreshSession } from "@/lib/auth";
import { getErrorMessage, isUnauthorizedError } from "@/lib/axios";
import { useSession } from "@/components/auth/SessionProvider";

export function useProtectedUser() {
  const router = useRouter();
  const { user, setUser } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const currentUser = await getMe();
        if (active) setUser(currentUser);
      } catch (initialError) {
        if (!isUnauthorizedError(initialError)) {
          if (active) setError(getErrorMessage(initialError));
          return;
        }
        try {
          await refreshSession();
          const currentUser = await getMe();
          if (active) setUser(currentUser);
        } catch {
          if (active) {
            setUser(null);
            router.replace("/login");
          }
        }
      }
    }
    void restore();
    return () => { active = false; };
  }, [router, setUser]);

  return { user, error };
}
