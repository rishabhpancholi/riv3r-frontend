import { api } from "./axios";

export interface OrganizationOnboardingPayload {
  company_email: string;
  registered_name: string;
  website_url: string | null;
  industry: string;
  org_type: "client" | "agency";
  owner: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: string | null;
  };
}

export async function onboardOrganization(
  payload: OrganizationOnboardingPayload
): Promise<void> {
  await api.post("/onboarding/organization", payload);
}

export interface ResourceOnboardingPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number: string | null;
  title: string;
  bio: string | null;
  location: string | null;
  skills: string[];
  experience_years: number;
  portfolio_url: string | null;
  linked_in_url: string | null;
}

export async function onboardResource(
  payload: ResourceOnboardingPayload
): Promise<void> {
  await api.post("/onboarding/resource", payload);
}
