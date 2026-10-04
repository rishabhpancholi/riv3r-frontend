import { api } from "./axios";

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  verification_status: "in_progress" | "approved" | "rejected";
  org_id: string;
  created_at: string;
  updated_at: string;
}

export async function listOrganizationUsers(): Promise<OrganizationUser[]> {
  const { data } = await api.get<OrganizationUser[]>("/users");
  return data;
}
