import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/axios", () => ({ api: { get: vi.fn(), post: vi.fn() } }));

import { api } from "@/lib/axios";
import { createProject, getProject, listProjects, publishProject, type CreateProjectPayload, type Project } from "@/lib/projects";
import { listOrganizationUsers } from "@/lib/users";

const mockGet = vi.mocked(api.get), mockPost = vi.mocked(api.post);
const project: Project = { id: "project-1", created_at: "2026-10-04T00:00:00Z", updated_at: "2026-10-04T00:00:00Z", deleted_at: null, org_id: "org-1", created_by_user_id: "user-1", spoc_user_id: "user-2", title: "Modernization", description: "Modernize the platform", status: "draft", deadline_date: "2026-12-31", budget: "12500.00", currency: "INR", published_at: null, domain: "Software", skill_tags: ["react"] };
const payload: CreateProjectPayload = { spoc_user_id: "user-2", title: "Modernization", description: "Modernize the platform", deadline_date: "2026-12-31", budget: 12500, currency: "INR", domain: "Software", skill_tags: ["react"], publish_also: false };

beforeEach(() => vi.clearAllMocks());

describe("project API", () => {
  it("serializes list filters including repeated skill tags", async () => {
    mockGet.mockResolvedValue({ data: { items: [project], page: 2, page_size: 12, total: 13, total_pages: 2 } });
    await listProjects({ page: 2, status: "draft", skill_tags: ["react", "typescript"] });
    const [, config] = mockGet.mock.calls[0];
    expect(mockGet).toHaveBeenCalledWith("/projects", expect.any(Object));
    expect(String(config?.params)).toBe("page=2&status=draft&skill_tags=react&skill_tags=typescript");
  });

  it("gets one project", async () => { mockGet.mockResolvedValue({ data: project }); await expect(getProject("project-1")).resolves.toEqual(project); expect(mockGet).toHaveBeenCalledWith("/projects/project-1"); });
  it("creates a draft with the complete payload", async () => { mockPost.mockResolvedValue({ data: project }); await createProject(payload); expect(mockPost).toHaveBeenCalledWith("/projects", payload); });
  it("publishes a project", async () => { mockPost.mockResolvedValue({ data: { ...project, status: "published" } }); await publishProject("project-1"); expect(mockPost).toHaveBeenCalledWith("/projects/project-1/publish"); });
  it("propagates request errors", async () => { mockGet.mockRejectedValue(new Error("Network error")); await expect(listProjects()).rejects.toThrow("Network error"); });
});

describe("organization users API", () => {
  it("requests the current organization directory", async () => { const users = [{ id: "user-2", name: "Alex", email: "alex@example.com" }]; mockGet.mockResolvedValue({ data: users }); await expect(listOrganizationUsers()).resolves.toEqual(users); expect(mockGet).toHaveBeenCalledWith("/users"); });
});
