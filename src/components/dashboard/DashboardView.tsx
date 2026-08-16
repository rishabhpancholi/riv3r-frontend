import type { ReactNode } from "react";
import { ArrowUpRight, Clock, ShieldX } from "lucide-react";

import type { User } from "@/lib/auth";

const GMAIL_COMPOSE_URL =
  "https://mail.google.com/mail/?view=cm&fs=1&to=admin%40riv3r.com";

function VerificationCard({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 text-center shadow-sm md:p-10">
        {icon}
        <h2 className="text-2xl font-semibold text-blue-950">{title}</h2>
        <p className="text-sm text-blue-900/60">
          For more queries, mail at{" "}
          <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            admin@riv3r.com
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </p>
      </div>
    </main>
  );
}

export default function DashboardView({ user }: { user: User }) {
  if (user.verification_status === "in_progress") {
    return (
      <VerificationCard
        icon={<Clock className="h-16 w-16 text-amber-500" />}
        title="Your Verification is under progress"
      />
    );
  }

  if (user.verification_status === "rejected") {
    return (
      <VerificationCard
        icon={<ShieldX className="h-16 w-16 text-red-500" />}
        title="Your Verification was rejected"
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 text-center shadow-sm md:p-10">
        <h1 className="text-2xl font-semibold text-blue-950">
          Welcome, {user.name}
        </h1>
        <p className="mt-2 text-sm text-blue-900/60">{user.email}</p>
        <p className="mt-4 inline-block rounded-lg bg-white/70 px-4 py-2 text-xs font-medium text-blue-900/50">
          User ID: {user.id}
        </p>
      </div>
    </main>
  );
}