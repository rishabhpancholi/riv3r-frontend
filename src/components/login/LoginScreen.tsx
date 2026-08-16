"use client";

import LoginForm from "./LoginForm";

export default function LoginScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <LoginForm />
    </main>
  );
}
