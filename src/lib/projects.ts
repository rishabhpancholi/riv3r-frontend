import { api } from "./axios";

export type ProjectStatus = "draft" | "published" | "closed" | "cancelled";
export type ProjectSortField = "created_at" | "deadline_date" | "published_at";
export type SortOrder = "asc" | "desc";

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  org_id: string;
  created_by_user_id: string;
  spoc_user_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  deadline_date: string;
  budget: string;
  currency: string;
  published_at: string | null;
  domain: string;
  skill_tags: string[];
}

export interface ProjectList {
  items: Project[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ProjectFilters {
  page?: number;
  page_size?: number;
  spoc_user_id?: string;
  status?: ProjectStatus;
  title?: string;
  description?: string;
  domain?: string;
  skill_tags?: string[];
  sort_by?: ProjectSortField;
  sort_order?: SortOrder;
}

export interface CreateProjectPayload {
  spoc_user_id: string;
  title: string;
  description: string;
  deadline_date: string;
  budget: number;
  currency: string;
  domain: string;
  skill_tags: string[];
  publish_also: boolean;
}

export async function listProjects(filters: ProjectFilters = {}): Promise<ProjectList> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) return;
    if (Array.isArray(value)) value.forEach(item => params.append(key, item));
    else params.set(key, String(value));
  });
  const { data } = await api.get<ProjectList>("/projects", { params });
  return data;
}

export async function getProject(projectId: string): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>("/projects", payload);
  return data;
}

export async function publishProject(projectId: string): Promise<Project> {
  const { data } = await api.post<Project>(`/projects/${projectId}/publish`);
  return data;
}
