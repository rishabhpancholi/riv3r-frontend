import { api } from "./axios";
import type { LoginFormValues } from "./schemas";

export interface User {
  id: string;
  email: string;
  name: string;
  verification_status: "in_progress" | "approved" | "rejected";
  phone_number?: string | null;
  is_resource: boolean;
  org_id?: string | null;
  is_owner?: boolean | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export async function login(credentials: LoginFormValues): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function refreshSession(): Promise<void> {
  await api.post("/auth/refresh");
}
