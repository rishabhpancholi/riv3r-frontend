"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Riv3rLoader from "@/components/auth/Riv3rLoader";

const ROUTE_LOADER_MS = 700;

export default function RouteTransitionLoader({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => setIsLoading(false), ROUTE_LOADER_MS);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-50">
        <Riv3rLoader />
      </div>
    </>
  );
}
