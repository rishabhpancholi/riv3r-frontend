import type { ReactNode } from "react";

import SessionHeartbeat from "@/components/auth/SessionHeartbeat";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionHeartbeat />
      {children}
    </>
  );
}
