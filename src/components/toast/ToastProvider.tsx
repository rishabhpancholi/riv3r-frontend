"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        containerClassName="!top-4 !left-4 !right-4 sm:!left-auto"
        toastOptions={{ duration: 4000 }}
      />
    </>
  );
}
