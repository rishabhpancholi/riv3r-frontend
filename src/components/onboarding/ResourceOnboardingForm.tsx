"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  Globe,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";

import { getErrorMessage } from "@/lib/axios";
import { onboardResource } from "@/lib/onboarding";
import { resourceOnboardingSchema } from "@/lib/schemas";
import type { ResourceOnboardingFormValues } from "@/lib/schemas";
import { showErrorToast, showSuccessToast } from "@/components/toast/toast";
import Riv3rLoader from "@/components/auth/Riv3rLoader";
import RichTextEditor from "@/components/tiptap/RichTextEditor";
import SkillsInput from "@/components/onboarding/SkillsInput";
import PasswordField from "@/components/onboarding/PasswordField";
import {
  FieldError,
  fieldClasses,
} from "@/components/onboarding/FormControls";

function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function ResourceOnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResourceOnboardingFormValues>({
    resolver: zodResolver(resourceOnboardingSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      country_code: "+91",
      phone_number: "",
      title: "",
      bio: "",
      location: "",
      skills: [],
      experience_years: "0",
      portfolio_url: "",
      linked_in_url: "",
    },
  });

  const passwordValue = watch("password") ?? "";
  const skillsValue = watch("skills") ?? [];
  const bioValue = watch("bio") ?? "";
  const experienceYears = Number(watch("experience_years") ?? "0") || 0;

  const experienceLabel =
    experienceYears === 0
      ? "Fresher"
      : experienceYears > 30
        ? "30+ years"
        : `${experienceYears} ${experienceYears === 1 ? "year" : "years"}`;

  async function onSubmit(values: ResourceOnboardingFormValues) {
    setIsSubmitting(true);
    try {
      await onboardResource({
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        phone_number: values.phone_number.trim()
          ? `${values.country_code}${values.phone_number.trim()}`
          : null,
        title: values.title,
        bio: extractText(values.bio) ? values.bio : null,
        location: values.location.trim() ? values.location.trim() : null,
        skills: values.skills,
        experience_years: parseInt(values.experience_years, 10),
        portfolio_url: values.portfolio_url.trim() || null,
        linked_in_url: values.linked_in_url.trim() || null,
      });
      showSuccessToast("Resource onboarded successfully");
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
          Onboard Resource
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-8"
          noValidate
        >
          <section className="flex flex-col gap-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-semibold text-blue-950">
              Resource Details
            </h2>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-blue-950">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="title"
                  type="text"
                  placeholder="Software Engineer, Designer, PM..."
                  className={`${fieldClasses(!!errors.title)} pl-10 pr-4`}
                  {...register("title")}
                />
              </div>
              <FieldError message={errors.title?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-sm font-semibold text-blue-950">
                Bio{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <RichTextEditor
                value={bioValue}
                onChange={(html) => setValue("bio", html)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-semibold text-blue-950">
                Location{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="location"
                  type="text"
                  placeholder="Mumbai, India"
                  className={`${fieldClasses(!!errors.location)} pl-10 pr-4`}
                  {...register("location")}
                />
              </div>
              <FieldError message={errors.location?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="skills" className="text-sm font-semibold text-blue-950">
                Skills <span className="text-red-500">*</span>
              </label>
              <SkillsInput
                value={skillsValue}
                onChange={(skills) =>
                  setValue("skills", skills, { shouldValidate: true })
                }
              />
              <FieldError message={errors.skills?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-blue-950">
                Experience (Years) <span className="text-red-500">*</span>
              </label>
              <div className="flex h-12 w-full items-center justify-between rounded-lg border border-blue-200 bg-white transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
                <button
                  type="button"
                  onClick={() =>
                    setValue("experience_years", String(experienceYears - 1))
                  }
                  disabled={experienceYears === 0}
                  aria-label="Decrease experience years"
                  className="flex h-full items-center justify-center rounded-l-lg px-5 text-blue-400 transition hover:text-blue-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div
                  aria-live="polite"
                  className="text-sm font-medium text-blue-950"
                >
                  {experienceLabel}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setValue("experience_years", String(experienceYears + 1))
                  }
                  aria-label="Increase experience years"
                  className="flex h-full items-center justify-center rounded-r-lg px-5 text-blue-400 transition hover:text-blue-950"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <FieldError message={errors.experience_years?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="portfolio_url" className="text-sm font-semibold text-blue-950">
                Portfolio URL{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="portfolio_url"
                  type="url"
                  autoComplete="url"
                  placeholder="https://portfolio.example.com"
                  className={`${fieldClasses(!!errors.portfolio_url)} pl-10 pr-4`}
                  {...register("portfolio_url")}
                />
              </div>
              <FieldError message={errors.portfolio_url?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="linked_in_url" className="text-sm font-semibold text-blue-950">
                LinkedIn URL{" "}
                <span className="font-normal text-blue-900/40">(optional)</span>
              </label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="linked_in_url"
                  type="url"
                  autoComplete="url"
                  placeholder="https://linkedin.com/in/username"
                  className={`${fieldClasses(!!errors.linked_in_url)} pl-10 pr-4`}
                  {...register("linked_in_url")}
                />
              </div>
              <FieldError message={errors.linked_in_url?.message} />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-semibold text-blue-950">
              Account Details
            </h2>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-blue-950">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`${fieldClasses(!!errors.email)} pl-10 pr-4`}
                  {...register("email")}
                />
              </div>
              <FieldError message={errors.email?.message} />
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
                    className={`${fieldClasses(!!errors.first_name)} pl-10 pr-4`}
                    {...register("first_name")}
                  />
                </div>
                <FieldError message={errors.first_name?.message} />
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
                    className={`${fieldClasses(!!errors.last_name)} pl-10 pr-4`}
                    {...register("last_name")}
                  />
                </div>
                <FieldError message={errors.last_name?.message} />
              </div>
            </div>

            <PasswordField
              id="password"
              register={register("password")}
              value={passwordValue}
              error={errors.password?.message}
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
                    {...register("country_code")}
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
                    className={`${fieldClasses(!!errors.phone_number)} pl-10 pr-4`}
                    {...register("phone_number")}
                  />
                </div>
              </div>
              <FieldError message={errors.phone_number?.message} />
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
            Onboarding as an Organization?{" "}
            <Link
              href="/onboarding/organization"
              className="font-semibold text-blue-950 underline-offset-4 hover:underline"
            >
              Switch to Organization
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}