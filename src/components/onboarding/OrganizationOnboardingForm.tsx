"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Factory,
  Globe,
  Loader2,
  Mail,
  Phone,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";

import { getErrorMessage } from "@/lib/axios";
import { onboardOrganization } from "@/lib/onboarding";
import { organizationOnboardingSchema } from "@/lib/schemas";
import type { OrganizationOnboardingFormValues } from "@/lib/schemas";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import PasswordField from "@/components/onboarding/PasswordField";
import {
  FieldError,
  fieldClasses,
} from "@/components/onboarding/FormControls";

export default function OrganizationOnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
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
    <main className="flex min-h-screen flex-col bg-gradient-to-t from-blue-100 via-blue-50/50 to-zinc-50 px-6 py-12">
      <div className="mx-auto w-[80%]">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm font-medium text-blue-900/60 shadow-sm transition hover:border-blue-300 hover:bg-white hover:text-blue-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-blue-950">
          Onboard Organization
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-8"
          noValidate
        >
          <section className="flex flex-col gap-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-semibold text-blue-950">
              Organization Details
            </h2>

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
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <select
                  id="org_type"
                  className={`${fieldClasses(false)} appearance-none pl-10 pr-10`}
                  {...register("org_type")}
                >
                  <option value="client">Client</option>
                  <option value="agency">Agency</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-semibold text-blue-950">Owner Details</h2>

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
                    className="h-12 w-full appearance-none rounded-lg border border-blue-200 bg-white pl-3 pr-8 text-sm text-blue-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-blue-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 [background-image:linear-gradient(90deg,#7dd3fc,#818cf8,#c084fc,#f472b6)]"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Rocket className="h-5 w-5" />
            )}
            {isSubmitting ? "Onboarding..." : "Finalize and Onboard"}
          </button>

          <p className="text-center text-sm text-blue-900/60">
            Onboarding as a Resource?{" "}
            <Link
              href="/onboarding/resource"
              className="font-semibold text-blue-950 underline-offset-4 hover:underline"
            >
              Switch to Resource
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
