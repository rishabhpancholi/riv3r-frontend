import { ArrowUpRight, Building2, UserRound } from "lucide-react";
import Link from "next/link";

export default function Onboarding() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 text-center shadow-sm md:p-12">
        <h1 className="bg-clip-text text-4xl font-extrabold tracking-tight text-transparent [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)]">
          RIV3R
        </h1>
        <p className="mt-2 text-center text-sm font-medium text-blue-900/60">
          Start your journey with RIV3R
        </p>

        <h2 className="text-lg font-semibold text-blue-950">
          Choose your role
        </h2>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/onboarding/organization"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-blue-950 shadow-sm transition hover:opacity-90 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
          >
            <Building2 className="h-10 w-10 transition group-hover:scale-105" />
            <span className="text-base font-semibold">Organization</span>
          </Link>

          <Link
            href="/onboarding/resource"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-blue-950 shadow-sm transition hover:opacity-90 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
          >
            <UserRound className="h-10 w-10 transition group-hover:scale-105" />
            <span className="text-base font-semibold">Resource</span>
          </Link>
        </div>

        <p className="mt-2 text-center text-sm text-blue-900/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            Sign In
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </main>
  );
}
