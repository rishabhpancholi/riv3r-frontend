import { ArrowRight, LogIn, Rocket } from "lucide-react";
import Link from "next/link";

import Typewriter from "@/components/typewriter/Typewriter";
import SessionCheck from "@/components/auth/SessionCheck";

export default function Home() {
  return (
    <SessionCheck>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12 md:py-16">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 shadow-sm grid-rows-[auto_1px_auto] md:grid-cols-[1fr_1px_1fr] md:grid-rows-1">
        <div className="flex flex-col justify-center gap-6 p-12 md:p-16">
          <h1 className="bg-clip-text text-6xl font-extrabold tracking-tight text-transparent [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)] md:text-7xl">
            RIV3R
          </h1>
          <p className="h-9 text-xl font-medium text-blue-900/60 md:text-2xl">
            <Typewriter />
          </p>
        </div>

        <div className="bg-gradient-to-r from-transparent via-blue-200 to-transparent md:bg-gradient-to-b" />

        <div className="flex flex-col">
          <div className="flex flex-1 flex-col justify-center gap-4 p-12 md:p-14">
            <h2 className="text-2xl font-semibold text-blue-950">Get Started</h2>
            <p className="text-base leading-relaxed text-blue-900/60">
              Bring your projects and talent together on one platform.
            </p>
            <Link
              href="/onboarding"
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-blue-950 transition hover:opacity-90 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
            >
              <Rocket className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="flex flex-1 flex-col justify-center gap-4 p-12 md:p-14">
            <h2 className="text-2xl font-semibold text-blue-950">Log In</h2>
            <p className="text-base leading-relaxed text-blue-900/60">
              Access your account and continue where you left off.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-blue-950 transition hover:opacity-90 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
            >
              <LogIn className="h-5 w-5" />
              Log In
            </Link>
          </div>
        </div>
      </section>
      </main>
    </SessionCheck>
  );
}
