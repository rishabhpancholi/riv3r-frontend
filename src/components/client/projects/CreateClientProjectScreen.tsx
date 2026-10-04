"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, FileText, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProtectedUser } from "@/components/auth/useProtectedUser";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import AccessDenied from "@/components/auth/AccessDenied";
import AppShell from "@/components/dashboard/AppShell";
import { FieldError, fieldClasses } from "@/components/onboarding/FormControls";
import SkillsInput from "@/components/onboarding/SkillsInput";
import RichTextEditor from "@/components/tiptap/RichTextEditor";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canAccessRoute, hasPermission, PROJECT_CREATE_POLICY } from "@/lib/access-control";
import { getErrorMessage } from "@/lib/axios";
import { createProject } from "@/lib/projects";
import { createProjectSchema, type CreateProjectFormValues } from "@/lib/schemas";
import { listOrganizationUsers, type OrganizationUser } from "@/lib/users";
import ProjectSelect from "./ProjectSelect";

export default function CreateClientProjectScreen() {
  const { user, error } = useProtectedUser();
  const router = useRouter();
  const [users, setUsers] = useState<OrganizationUser[]>([]), [usersLoading, setUsersLoading] = useState(true), [usersError, setUsersError] = useState<string | null>(null), [intent, setIntent] = useState<"draft" | "publish" | null>(null);
  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateProjectFormValues>({ resolver: zodResolver(createProjectSchema), defaultValues: { spoc_user_id: "", title: "", description: "", deadline_date: "", budget: "", currency: "INR", domain: "", skill_tags: [] } });
  useEffect(() => { if (!user || !canAccessRoute(user, PROJECT_CREATE_POLICY)) return; let active = true; setUsersLoading(true); listOrganizationUsers().then(result => { if (active) { setUsers(result.filter(item => item.verification_status === "approved")); setUsersError(null); } }).catch(loadError => { if (active) setUsersError(getErrorMessage(loadError)); }).finally(() => { if (active) setUsersLoading(false); }); return () => { active = false; }; }, [user]);
  async function submit(values: CreateProjectFormValues, publishAlso: boolean) { setIntent(publishAlso ? "publish" : "draft"); try { await createProject({ ...values, title: values.title.trim(), description: values.description.trim(), budget: Number(values.budget), currency: values.currency.trim().toUpperCase(), domain: values.domain.trim(), skill_tags: values.skill_tags.map(tag => tag.trim().toLowerCase()), publish_also: publishAlso }); showSuccessToast(publishAlso ? "Project created and published." : "Project saved as a draft."); router.push("/client/projects"); router.refresh(); } catch (submitError) { showErrorToast(getErrorMessage(submitError)); setIntent(null); } }
  if (error) return <main className="grid min-h-screen place-items-center bg-canvas px-4"><Card className="max-w-md p-7 text-center"><h1 className="text-xl font-semibold">We couldn’t load this page.</h1><p className="mt-2 text-sm leading-6 text-muted">{error}</p></Card></main>;
  if (!user) return <Riv3rLoader />; if (!canAccessRoute(user, PROJECT_CREATE_POLICY)) return <AccessDenied user={user} />;
  const canPublish = hasPermission(user, "projects.publish"), submitting = intent !== null;
  return <AppShell user={user} activePath="/client/projects"><div className="mx-auto max-w-4xl"><Link href="/client/projects" className={buttonVariants({ variant: "ghost", className: "-ml-3 mb-4" })}><ArrowLeft className="h-4 w-4" /> Back to projects</Link><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">New project</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Create project</h1><p className="mt-3 max-w-2xl leading-7 text-muted">Capture the project brief now. You can keep it private as a draft or publish it immediately.</p></div>
    <form className="mt-7 space-y-6" onSubmit={event => event.preventDefault()}><Card className="p-5 sm:p-7"><h2 className="text-lg font-semibold">Project brief</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Project title</span><input {...register("title")} aria-invalid={Boolean(errors.title)} className={`${fieldClasses(Boolean(errors.title))} px-3`} placeholder="e.g. Customer portal redesign" /><FieldError message={errors.title?.message} /></label>
      <div className="sm:col-span-2"><label id="project-description-label" className="mb-2 block text-sm font-semibold">Description</label><Controller control={control} name="description" render={({ field }) => <div aria-labelledby="project-description-label" aria-invalid={Boolean(errors.description)} className={errors.description ? "rounded-xl ring-2 ring-danger/30" : undefined}><RichTextEditor value={field.value} onChange={field.onChange} placeholder="Describe the scope, outcomes, deliverables, and important context…" /></div>} /><FieldError message={errors.description?.message} /></div>
      <label><span className="mb-2 block text-sm font-semibold">Domain</span><input {...register("domain")} aria-invalid={Boolean(errors.domain)} className={`${fieldClasses(Boolean(errors.domain))} px-3`} placeholder="e.g. Financial services" /><FieldError message={errors.domain?.message} /></label>
      <div><label htmlFor="spoc_user_id" className="mb-2 block text-sm font-semibold">Person of contact</label><Controller control={control} name="spoc_user_id" render={({ field }) => <ProjectSelect id="spoc_user_id" value={field.value} onValueChange={field.onChange} disabled={usersLoading || Boolean(usersError)} invalid={Boolean(errors.spoc_user_id)} ariaLabel="Person of contact" placeholder={usersLoading ? "Loading team members…" : "Select a team member"} options={users.map(item => ({ value: item.id, label: `${item.name} · ${item.email}` }))} />} /><FieldError message={errors.spoc_user_id?.message ?? usersError ?? undefined} /></div>
    </div></Card><Card className="p-5 sm:p-7"><h2 className="text-lg font-semibold">Delivery and budget</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label><span className="mb-2 block text-sm font-semibold">Deadline</span><input type="date" {...register("deadline_date")} aria-invalid={Boolean(errors.deadline_date)} className={`${fieldClasses(Boolean(errors.deadline_date))} px-3`} /><FieldError message={errors.deadline_date?.message} /></label>
      <div className="grid grid-cols-[1fr_7rem] gap-3"><label><span className="mb-2 block text-sm font-semibold">Budget</span><input type="number" min="0" step="0.01" {...register("budget")} aria-invalid={Boolean(errors.budget)} className={`${fieldClasses(Boolean(errors.budget))} px-3`} placeholder="0.00" /><FieldError message={errors.budget?.message} /></label><label><span className="mb-2 block text-sm font-semibold">Currency</span><input maxLength={3} {...register("currency", { onChange: event => { event.target.value = event.target.value.toUpperCase(); } })} aria-invalid={Boolean(errors.currency)} className={`${fieldClasses(Boolean(errors.currency))} px-3 uppercase`} /><FieldError message={errors.currency?.message} /></label></div>
      <div className="sm:col-span-2"><label className="mb-2 block text-sm font-semibold" id="skills-label">Required skills <span className="font-normal text-muted">(optional)</span></label><Controller control={control} name="skill_tags" render={({ field }) => <SkillsInput value={field.value} onChange={field.onChange} placeholder="Type a skill and press Enter" />} /></div>
    </div></Card><div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-line bg-surface/95 p-4 shadow-card backdrop-blur sm:flex-row sm:justify-end"><Button type="button" variant="secondary" disabled={submitting || usersLoading || Boolean(usersError)} onClick={() => void handleSubmit(values => submit(values, false))()}>{intent === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}{intent === "draft" ? "Saving…" : "Save draft"}</Button>{canPublish && <Button type="button" disabled={submitting || usersLoading || Boolean(usersError)} onClick={() => void handleSubmit(values => submit(values, true))()}>{intent === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{intent === "publish" ? "Publishing…" : "Publish project"}</Button>}</div></form>
  </div></AppShell>;
}
