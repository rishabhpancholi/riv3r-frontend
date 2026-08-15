"use client";

import { useEffect, useState } from "react";

import LoginForm from "./LoginForm";
import Riv3rLoader from "@/components/auth/Riv3rLoader";

export default function LoginScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!ready) return <Riv3rLoader />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <LoginForm />
    </main>
  );
}
