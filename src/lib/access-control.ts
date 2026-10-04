import type { User } from "@/lib/auth";

export type OrgType = "client" | "agency" | "riv3r" | "resource";
export type Permission = "projects.view" | "projects.create" | "projects.publish" | "users.view";

export interface RoutePolicy {
  orgTypes?: readonly OrgType[];
  allOf?: readonly Permission[];
  anyOf?: readonly Permission[];
}

export interface NavigationItem {
  href: "/" | "/client/projects";
  label: string;
  permission?: Permission;
}

export const WORKSPACE_NAVIGATION: readonly NavigationItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/client/projects", label: "Projects", permission: "projects.view" },
];

export const PROJECTS_POLICY: RoutePolicy = { orgTypes: ["client"], allOf: ["projects.view"] };
export const PROJECT_CREATE_POLICY: RoutePolicy = { orgTypes: ["client"], allOf: ["projects.create"] };

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
}

export function canAccessRoute(user: User | null | undefined, policy: RoutePolicy): boolean {
  if (!user) return false;
  if (policy.orgTypes && (!user.org_type || !policy.orgTypes.includes(user.org_type))) return false;
  const allOf = policy.allOf ?? [];
  const anyOf = policy.anyOf ?? [];
  return allOf.every(permission => hasPermission(user, permission)) &&
    (anyOf.length === 0 || anyOf.some(permission => hasPermission(user, permission)));
}

export function visibleNavigation(user: User): readonly NavigationItem[] {
  return WORKSPACE_NAVIGATION.filter(item => !item.permission || (user.org_type === "client" && hasPermission(user, item.permission)));
}
