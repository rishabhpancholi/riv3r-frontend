import type { ReactNode } from "react";
import { ArrowUpRight, BriefcaseBusiness, Clock3, ShieldCheck, ShieldX, Sparkles, UserRound } from "lucide-react";
import type { User } from "@/lib/auth";
import { hasPermission } from "@/lib/access-control";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import AppShell from "@/components/dashboard/AppShell";

const GMAIL_COMPOSE_URL = "https://mail.google.com/mail/?view=cm&fs=1&to=admin%40riv3r.com";
const ROLE_LABELS = { client: "Client", agency: "Agency", resource: "Independent professional", riv3r: "RIV3R" } as const;

function VerificationPanel({ tone, icon, title, copy }: { tone: "warning" | "danger"; icon: ReactNode; title: string; copy: string }) {
  return <Card className="max-w-3xl p-6 sm:p-9"><Badge tone={tone}>{icon}{tone === "warning" ? "Review in progress" : "Action needed"}</Badge><h1 className="mt-6 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h1><p className="mt-4 max-w-xl leading-7 text-muted">{copy}</p><div className="mt-8 rounded-xl bg-surface-muted p-5"><p className="text-sm font-semibold">Need help with your application?</p><p className="mt-1 text-sm leading-6 text-muted">Contact our team and include the email used for your profile.</p><a href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">admin@riv3r.com <ArrowUpRight className="h-4 w-4" /></a></div></Card>;
}

function ApprovedDashboard({ user }: { user: User }) {
  const canViewProjects = user.org_type === "client" && hasPermission(user, "projects.view");
  const roleLabel = user.org_type && user.org_type in ROLE_LABELS ? ROLE_LABELS[user.org_type as keyof typeof ROLE_LABELS] : "RIV3R account";
  const roleContent = user.org_type === "agency"
    ? { title: "Your agency profile is ready.", copy: "Your verified presence gives clients and professionals a trusted view of your agency as new collaboration tools become available." }
    : user.org_type === "resource"
      ? { title: "Your professional profile is ready.", copy: "Your experience and expertise are ready to represent you as new opportunities become available." }
      : { title: "Your workspace is ready.", copy: "Your verified account is set up for the capabilities currently available to your organization." };

  return <><div><Badge tone="success"><ShieldCheck className="h-3.5 w-3.5" /> Verified profile</Badge><h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Welcome, {user.name.split(" ")[0]}.</h1><p className="mt-3 text-muted">Your RIV3R workspace is ready for what comes next.</p></div><div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><Card className="p-6 sm:p-8"><div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">{canViewProjects ? <BriefcaseBusiness className="h-6 w-6" /> : user.org_type === "resource" ? <UserRound className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}</div><h2 className="mt-7 text-2xl font-semibold tracking-[-.03em]">{canViewProjects ? "Manage your work from one place." : roleContent.title}</h2><p className="mt-3 max-w-xl leading-7 text-muted">{canViewProjects ? "Projects are available from your workspace navigation." : roleContent.copy}</p></Card><Card className="p-6"><p className="text-sm font-semibold uppercase tracking-[.12em] text-muted">Account</p><div className="mt-6 space-y-5"><div><p className="text-xs text-muted">Profile type</p><p className="mt-1 text-sm font-semibold">{roleLabel}</p></div><div><p className="text-xs text-muted">Email</p><p className="mt-1 break-all text-sm font-semibold">{user.email}</p></div><div><p className="text-xs text-muted">Verification</p><p className="mt-1 text-sm font-semibold text-accent">Approved</p></div></div></Card></div></>;
}

export default function DashboardView({ user }: { user: User }) {
  let content: ReactNode;
  if (user.verification_status === "in_progress") content = <VerificationPanel tone="warning" icon={<Clock3 className="h-3.5 w-3.5" />} title="Your profile is being reviewed." copy="We’re checking the information you provided. Your workspace will open up after verification is complete." />;
  else if (user.verification_status === "rejected") content = <VerificationPanel tone="danger" icon={<ShieldX className="h-3.5 w-3.5" />} title="We couldn’t verify your profile." copy="Some of the submitted information needs attention. Contact the RIV3R team to understand what is required next." />;
  else content = <ApprovedDashboard user={user} />;
  return <AppShell user={user} activePath="/">{content}</AppShell>;
}
