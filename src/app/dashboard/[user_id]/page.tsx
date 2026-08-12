import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { User } from "@/lib/auth";

const API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) redirect("/login");

  let user: User | null = null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) redirect("/login");

    user = (await res.json()) as User;
  } catch {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 text-center shadow-sm md:p-10">
        <h1 className="text-2xl font-semibold text-blue-950">
          Welcome, {user.name}
        </h1>
        <p className="mt-2 text-sm text-blue-900/60">{user.email}</p>
        <p className="mt-4 inline-block rounded-lg bg-white/70 px-4 py-2 text-xs font-medium text-blue-900/50">
          User ID: {user_id}
        </p>
      </div>
    </main>
  );
}
