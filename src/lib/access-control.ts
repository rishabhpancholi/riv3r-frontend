import type { User } from "@/lib/auth";

export type AccountRole = "client" | "agency" | "resource";
export type Permission = "projects.read" | "projects.create";

export interface RoutePolicy {
  allOf?: readonly Permission[];
  anyOf?: readonly Permission[];
}

export interface NavigationItem {
  href: "/" | "/projects";
  label: string;
  permission?: Permission;
}

export const WORKSPACE_NAVIGATION: readonly NavigationItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects", permission: "projects.read" },
];

export const PROJECTS_POLICY: RoutePolicy = { allOf: ["projects.read"] };
export const PROJECT_CREATE_POLICY: RoutePolicy = { allOf: ["projects.create"] };

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
}

export function canAccessRoute(user: User | null | undefined, policy: RoutePolicy): boolean {
  if (!user) return false;
  const allOf = policy.allOf ?? [];
  const anyOf = policy.anyOf ?? [];
  return allOf.every(permission => hasPermission(user, permission)) &&
    (anyOf.length === 0 || anyOf.some(permission => hasPermission(user, permission)));
}

export function visibleNavigation(user: User): readonly NavigationItem[] {
  return WORKSPACE_NAVIGATION.filter(item => !item.permission || hasPermission(user, item.permission));
}
