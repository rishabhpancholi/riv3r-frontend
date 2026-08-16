import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-8 text-center shadow-sm md:p-10">
        <SearchX className="h-14 w-14 text-blue-950" />

        <h1 className="bg-clip-text text-7xl font-extrabold tracking-tight text-transparent [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)]">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-blue-950">
          Page not found
        </h2>

        <p className="text-sm text-blue-900/60">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-2 flex w-full flex-col gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-blue-950 transition hover:opacity-90 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white/70 px-8 text-base font-semibold text-blue-950 shadow-sm transition hover:border-blue-300 hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
}