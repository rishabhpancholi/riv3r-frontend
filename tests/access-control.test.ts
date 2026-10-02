import { describe, expect, it } from "vitest";
import { canAccessRoute, hasPermission, PROJECT_CREATE_POLICY, PROJECTS_POLICY, visibleNavigation } from "@/lib/access-control";
import type { User } from "@/lib/auth";

function user(overrides: Partial<User> = {}): User {
  return { id: "user-1", email: "user@example.com", name: "Test User", verification_status: "approved", is_resource: false, created_at: "2026-01-01", updated_at: "2026-01-01", account_role: "client", permissions: ["projects.read", "projects.create"], ...overrides };
}

describe("permission access", () => {
  it("allows an approved client with project permissions", () => {
    expect(canAccessRoute(user(), PROJECTS_POLICY)).toBe(true);
    expect(canAccessRoute(user(), PROJECT_CREATE_POLICY)).toBe(true);
  });

  it("allows project reading without project creation", () => {
    const readOnly = user({ permissions: ["projects.read"] });
    expect(canAccessRoute(readOnly, PROJECTS_POLICY)).toBe(true);
    expect(canAccessRoute(readOnly, PROJECT_CREATE_POLICY)).toBe(false);
  });

  it.each([
    ["pending client", { verification_status: "in_progress", permissions: [] }],
    ["rejected client", { verification_status: "rejected", permissions: [] }],
    ["agency", { account_role: "agency", permissions: [] }],
    ["resource", { account_role: "resource", is_resource: true, permissions: [] }],
    ["missing permissions", { permissions: undefined }],
    ["empty permissions", { permissions: [] }],
  ] as const)("fails closed for %s", (_label, overrides) => {
    expect(canAccessRoute(user(overrides as Partial<User>), PROJECTS_POLICY)).toBe(false);
  });

  it("handles duplicates without expanding access", () => {
    expect(hasPermission(user({ permissions: ["projects.read", "projects.read"] }), "projects.create")).toBe(false);
  });

  it("ignores unknown permissions and roles at runtime", () => {
    const futureUser = user({ account_role: "future-role", permissions: ["future.permission"] } as unknown as Partial<User>);
    expect(canAccessRoute(futureUser, PROJECTS_POLICY)).toBe(false);
    expect(visibleNavigation(futureUser).map(item => item.label)).toEqual(["Dashboard"]);
  });

  it("filters navigation from the same permission source", () => {
    expect(visibleNavigation(user()).map(item => item.label)).toEqual(["Dashboard", "Projects"]);
    expect(visibleNavigation(user({ permissions: [] })).map(item => item.label)).toEqual(["Dashboard"]);
  });
});
