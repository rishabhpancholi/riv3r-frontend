"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "radix-ui";
import {
  Building2,
  Check,
  ChevronDown,
  Factory,
  Globe,
  Loader2,
  Mail,
  Phone,
  Rocket,
  User,
} from "lucide-react";

import { getErrorMessage } from "@/lib/axios";
import { onboardOrganization } from "@/lib/onboarding";
import { organizationOnboardingSchema } from "@/lib/schemas";
import type { OrganizationOnboardingFormValues } from "@/lib/schemas";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import PasswordField from "@/components/onboarding/PasswordField";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import {
  FieldError,
  fieldClasses,
} from "@/components/onboarding/FormControls";

export default function OrganizationOnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrganizationOnboardingFormValues>({
    resolver: zodResolver(organizationOnboardingSchema),
    defaultValues: {
      company_email: "",
      registered_name: "",
      website_url: "",
      industry: "",
      org_type: "client",
      owner: {
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        country_code: "+91",
        phone_number: "",
      },
    },
  });

  const passwordValue = watch("owner.password") ?? "";

  async function onSubmit(values: OrganizationOnboardingFormValues) {
    setIsSubmitting(true);
    try {
      await onboardOrganization({
        company_email: values.company_email,
        registered_name: values.registered_name,
        website_url: values.website_url.trim() || null,
        industry: values.industry,
        org_type: values.org_type,
        owner: {
          email: values.owner.email,
          first_name: values.owner.first_name,
          last_name: values.owner.last_name,
          password: values.owner.password,
          phone_number: values.owner.phone_number.trim()
            ? `${values.owner.country_code}${values.owner.phone_number.trim()}`
            : null,
        },
      });
      showSuccessToast("Organization onboarded successfully");
      setIsRedirecting(true);
      router.push("/");
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRedirecting) {
    return <Riv3rLoader />;
  }

  return (
    <OnboardingShell title="Create your organization profile" description="Tell us about the organization and the account owner responsible for managing its RIV3R presence.">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-2"
          noValidate
        >
          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Organization</p><h2 className="mt-2 text-xl font-semibold text-ink">Company details</h2><p className="mt-1 text-sm leading-6 text-muted">Public and operational information about your team.</p></div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company_email" className="text-sm font-semibold text-blue-950">
                Company Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="company_email"
                  type="email"
                  autoComplete="organization"
                  placeholder="company@riv3r.com"
                  className={`${fieldClasses(!!errors.company_email)} pl-10 pr-4`}
                  {...register("company_email")}
                />
              </div>
              <FieldError message={errors.company_email?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="registered_name" className="text-sm font-semibold text-blue-950">
                Registered Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="registered_name"
                  type="text"
                  placeholder="Acme Corporation"
                  className={`${fieldClasses(!!errors.registered_name)} pl-10 pr-4`}
                  {...register("registered_name")}
                />
              </div>
              <FieldError message={errors.registered_name?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="website_url" className="text-sm font-semibold text-blue-950">
                Website URL{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="website_url"
                  type="url"
                  autoComplete="url"
                  placeholder="https://acme.com"
                  className={`${fieldClasses(!!errors.website_url)} pl-10 pr-4`}
                  {...register("website_url")}
                />
              </div>
              <FieldError message={errors.website_url?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="industry" className="text-sm font-semibold text-blue-950">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Factory className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="industry"
                  type="text"
                  placeholder="Technology, Finance, Healthcare..."
                  className={`${fieldClasses(!!errors.industry)} pl-10 pr-4`}
                  {...register("industry")}
                />
              </div>
              <FieldError message={errors.industry?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="org_type" className="text-sm font-semibold text-blue-950">
                Organization Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="org_type"
                control={control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger
                      id="org_type"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.org_type}
                      className={`${fieldClasses(!!errors.org_type)} group flex items-center pl-3 pr-3 text-left data-[placeholder]:text-blue-300`}
                    >
                      <Building2 className="mr-2 h-5 w-5 shrink-0 text-blue-400" />
                      <Select.Value placeholder="Select organization type" />
                      <Select.Icon className="ml-auto text-blue-400">
                        <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        sideOffset={6}
                        className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-blue-200 bg-white p-1 shadow-lg shadow-blue-950/10 data-[state=closed]:animate-out data-[state=open]:animate-in"
                      >
                        <Select.Viewport>
                          {[
                            { value: "client", label: "Client" },
                            { value: "agency", label: "Agency" },
                          ].map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="relative flex h-10 cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-9 text-sm text-blue-950 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-950"
                            >
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute right-3 inline-flex items-center text-sky-600">
                                <Check className="h-4 w-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                )}
              />
              <FieldError message={errors.org_type?.message} />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Account owner</p><h2 className="mt-2 text-xl font-semibold text-ink">Personal details</h2><p className="mt-1 text-sm leading-6 text-muted">The owner email must share the organization email domain.</p></div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="owner_email" className="text-sm font-semibold text-blue-950">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="owner_email"
                  type="email"
                  autoComplete="email"
                  placeholder="owner@riv3r.com"
                  className={`${fieldClasses(!!errors.owner?.email)} pl-10 pr-4`}
                  {...register("owner.email")}
                />
              </div>
              <FieldError message={errors.owner?.email?.message} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="first_name" className="text-sm font-semibold text-blue-950">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                  <input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Jane"
                    className={`${fieldClasses(!!errors.owner?.first_name)} pl-10 pr-4`}
                    {...register("owner.first_name")}
                  />
                </div>
                <FieldError message={errors.owner?.first_name?.message} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="last_name" className="text-sm font-semibold text-blue-950">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                  <input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    className={`${fieldClasses(!!errors.owner?.last_name)} pl-10 pr-4`}
                    {...register("owner.last_name")}
                  />
                </div>
                <FieldError message={errors.owner?.last_name?.message} />
              </div>
            </div>

            <PasswordField
              id="password"
              register={register("owner.password")}
              value={passwordValue}
              error={errors.owner?.password?.message}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone_number" className="text-sm font-semibold text-blue-950">
                Phone Number{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="relative w-36 shrink-0">
                  <select
                    id="country_code"
                    aria-label="Phone country code"
                    className="h-10 w-full appearance-none rounded-lg border border-blue-200 bg-white pl-3 pr-8 text-sm text-blue-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    {...register("owner.country_code")}
                  >
                    <option value="+91">+91 (India)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                </div>

                <div className="relative flex-1">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                  <input
                    id="phone_number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    className={`${fieldClasses(!!errors.owner?.phone_number)} pl-10 pr-4`}
                    {...register("owner.phone_number")}
                  />
                </div>
              </div>
              <FieldError message={errors.owner?.phone_number?.message} />
            </div>
          </section>

          <button type="submit" disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Rocket className="h-5 w-5" />
            )}
            {isSubmitting ? "Onboarding..." : "Finalize and Onboard"}
          </button>

        </form>
    </OnboardingShell>
  );
}
