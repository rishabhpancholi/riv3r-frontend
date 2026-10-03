"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Loader2, LogOut, UserRound, FolderKanban } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { User } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { getErrorMessage } from "@/lib/axios";
import { showErrorToast } from "@/components/toast/toast";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { useSession } from "@/components/auth/SessionProvider";
import { visibleNavigation } from "@/lib/access-control";

const NAV_ICONS = { "/": LayoutDashboard, "/client/projects": FolderKanban } as const;
const ROLE_LABELS = {
  client: "Client account",
  agency: "Agency account",
  resource: "Professional account",
  riv3r: "RIV3R account",
} as const;

export default function AppShell({ user, activePath, children }: { user: User; activePath: "/" | "/client/projects"; children: ReactNode }) {
  const router = useRouter();
  const { setUser } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = user.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const links = visibleNavigation(user);
  const roleLabel = user.org_type && user.org_type in ROLE_LABELS ? ROLE_LABELS[user.org_type as keyof typeof ROLE_LABELS] : "RIV3R account";

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setUser(null);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      showErrorToast(getErrorMessage(error));
      setIsLoggingOut(false);
    }
  }

  return <main className="min-h-screen bg-canvas">
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Logo />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex min-h-11 items-center gap-2 rounded-xl px-1.5 text-left transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20" aria-label="Open account menu">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user.name}</p><p className="max-w-52 truncate text-xs text-muted">{user.email}</p></div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white" aria-hidden="true">{initials}</span>
            <ChevronDown className="h-4 w-4 text-muted" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-64 rounded-xl border border-line bg-surface p-2 shadow-card">
              <div className="border-b border-line px-3 py-2.5 sm:hidden"><p className="text-sm font-semibold">{user.name}</p><p className="mt-0.5 truncate text-xs text-muted">{user.email}</p></div>
              <DropdownMenu.Item asChild><div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted outline-none"><UserRound className="h-4 w-4" />{roleLabel}</div></DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-line" />
              <DropdownMenu.Item onSelect={event => { event.preventDefault(); void handleLogout(); }} disabled={isLoggingOut} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-danger outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-danger-soft">
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}{isLoggingOut ? "Logging out…" : "Log out"}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <nav aria-label="Workspace" className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden">{links.map(({href,label}) => { const Icon = NAV_ICONS[href]; return <Link key={href} href={href} className={cn("inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold", activePath === href ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-ink")}><Icon className="h-4 w-4" />{label}</Link>; })}</nav>
    </header>
    <div className="mx-auto grid max-w-[1440px] md:grid-cols-[220px_1fr]">
      <aside className="hidden min-h-[calc(100vh-4.5rem)] border-r border-line p-5 md:block"><nav aria-label="Workspace" className="space-y-1">{links.map(({href,label}) => { const Icon = NAV_ICONS[href]; return <Link key={href} href={href} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition", activePath === href ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-ink")}><Icon className="h-4 w-4" />{label}</Link>; })}</nav></aside>
      <div className="min-w-0 p-4 sm:p-7 lg:p-10">{children}</div>
    </div>
  </main>;
}
