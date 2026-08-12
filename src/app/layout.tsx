import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { ToastProvider } from "@/components/toast/ToastProvider";

export const metadata: Metadata = {
  title: "RIV3R",
  description: "Where work flows seamlessly",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
