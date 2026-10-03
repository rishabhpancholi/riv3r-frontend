import { describe, expect, it } from "vitest";
import { canAccessRoute, hasPermission, PROJECT_CREATE_POLICY, PROJECTS_POLICY, visibleNavigation } from "@/lib/access-control";
import type { User } from "@/lib/auth";

function user(overrides: Partial<User> = {}): User {
  return { id: "user-1", email: "user@example.com", name: "Test User", verification_status: "approved", is_resource: false, created_at: "2026-01-01", updated_at: "2026-01-01", org_type: "client", permissions: ["projects.view", "projects.create"], ...overrides };
}

describe("client project access", () => {
  it("allows a client with both project permissions", () => {
    expect(canAccessRoute(user(), PROJECTS_POLICY)).toBe(true);
    expect(canAccessRoute(user(), PROJECT_CREATE_POLICY)).toBe(true);
  });

  it("allows viewing without project creation", () => {
    const viewOnly = user({ permissions: ["projects.view"] });
    expect(canAccessRoute(viewOnly, PROJECTS_POLICY)).toBe(true);
    expect(canAccessRoute(viewOnly, PROJECT_CREATE_POLICY)).toBe(false);
  });

  it.each(["agency", "resource", "riv3r"] as const)("denies %s users even if a project permission is present", orgType => {
    expect(canAccessRoute(user({ org_type: orgType }), PROJECTS_POLICY)).toBe(false);
    expect(visibleNavigation(user({ org_type: orgType })).map(item => item.label)).toEqual(["Dashboard"]);
  });

  it.each([undefined, []] as const)("fails closed when permissions are absent or empty", permissions => {
    expect(canAccessRoute(user({ permissions: permissions as User["permissions"] }), PROJECTS_POLICY)).toBe(false);
  });

  it("handles duplicates without expanding access", () => {
    expect(hasPermission(user({ permissions: ["projects.view", "projects.view"] }), "projects.create")).toBe(false);
  });

  it("ignores unknown values at runtime", () => {
    const unknown = user({ org_type: "future-role", permissions: ["future.permission"] } as unknown as Partial<User>);
    expect(canAccessRoute(unknown, PROJECTS_POLICY)).toBe(false);
    expect(visibleNavigation(unknown).map(item => item.label)).toEqual(["Dashboard"]);
  });

  it("shows client Projects navigation only with projects.view", () => {
    expect(visibleNavigation(user()).map(item => item.href)).toEqual(["/", "/client/projects"]);
    expect(visibleNavigation(user({ permissions: ["projects.create"] })).map(item => item.href)).toEqual(["/"]);
  });
});
