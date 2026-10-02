import type { Metadata } from "next";
import OrganizationOnboardingForm from "@/components/onboarding/OrganizationOnboardingForm";
export const metadata: Metadata = { title: "Organization onboarding" };

export default function OrganizationOnboarding() {
  return <OrganizationOnboardingForm />;
}
