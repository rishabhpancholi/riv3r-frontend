import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider } from "@mantine/core";

import { ToastProvider } from "@/components/toast/ToastProvider";
import { SessionProvider } from "@/components/auth/SessionProvider";

export const metadata: Metadata = { title: { default: "RIV3R — Work, in motion", template: "%s | RIV3R" }, description: "A focused place for organizations and independent professionals to find the right working relationship." };
const geist = localFont({ src: "../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2", variable: "--font-geist-sans", display: "swap" });
const instrumentSerif = localFont({ src: [{ path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", style: "normal", weight: "400" }, { path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", style: "italic", weight: "400" }], variable: "--font-instrument-serif", display: "swap" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        <MantineProvider><SessionProvider><ToastProvider>{children}</ToastProvider></SessionProvider></MantineProvider>
      </body>
    </html>
  );
}
