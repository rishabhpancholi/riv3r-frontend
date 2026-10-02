import type { Metadata } from "next";
import ResourceOnboardingForm from "@/components/onboarding/ResourceOnboardingForm";
export const metadata: Metadata = { title: "Professional onboarding" };

export default function ResourceOnboarding() {
  return <ResourceOnboardingForm />;
}
