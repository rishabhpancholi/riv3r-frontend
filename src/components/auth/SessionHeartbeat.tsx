"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getMe, refreshSession } from "@/lib/auth";
import { isUnauthorizedError } from "@/lib/axios";

const HEARTBEAT_INTERVAL_MS = 30 * 60 * 1000;

export default function SessionHeartbeat() {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    async function heartbeat() {
      try {
        await getMe();
      } catch (error) {
        if (!isUnauthorizedError(error)) return;

        try {
          await refreshSession();
        } catch (refreshError) {
          if (isActive && isUnauthorizedError(refreshError)) {
            router.push("/login");
          }
        }
      }
    }

    const intervalId = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [router]);

  return null;
}
