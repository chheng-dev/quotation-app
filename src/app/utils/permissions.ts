import {
  Action,
  Permission,
  PermissionCheck,
  Resource,
  User,
  UserProfile,
  FlatPermission,
} from '@/src/types/rbac';

export function getUserPermissions(user: User | null | undefined) {
  if (!user) return [];

  const permissionsMap = new Map<string, Permission>();

  // Handle direct permissions (flat format: { resource, action })
  if (user.permissions && Array.isArray(user.permissions)) {
    user.permissions.forEach((perm) => {
      // Check if it's a flat permission (has 'action' instead of 'actions')
      if ('action' in perm) {
        const flatPerm = perm as FlatPermission;
        const resource = flatPerm.resource;
        const action = flatPerm.action;

        if (!resource || !action) return;

        const key = `${resource}:${JSON.stringify(flatPerm.conditions || {})}`;

        if (permissionsMap.has(key)) {
          const existing = permissionsMap.get(key)!;
          permissionsMap.set(key, {
            ...existing,
            actions: [...new Set([...(existing.actions || []), action])],
          });
        } else {
          permissionsMap.set(key, {
            resource,
            actions: [action],
            conditions: flatPerm.conditions,
          });
        }
      } else {
        // Handle grouped format
        const groupedPerm = perm as Permission;
        const key = `${groupedPerm.resource}:${JSON.stringify(groupedPerm.conditions || {})}`;

        if (permissionsMap.has(key)) {
          const existing = permissionsMap.get(key)!;
          permissionsMap.set(key, {
            ...existing,
            actions: [...new Set([...(existing.actions || []), ...groupedPerm.actions])],
          });
        } else {
          permissionsMap.set(key, groupedPerm);
        }
      }
    });
  }

  user.roles?.forEach((role) => {
    role.permissions?.forEach((permission) => {
      const key = `${permission.resource}:${JSON.stringify(permission.conditions || {})}`;

      if (permissionsMap.has(key)) {
        const existing = permissionsMap.get(key)!;
        permissionsMap.set(key, {
          ...existing,
          actions: [...new Set([...(existing?.actions || []), ...permission.actions])],
        });
      } else {
        permissionsMap.set(key, permission);
      }
    });
  });

  const result = Array.from(permissionsMap.values());
  return result;
}

export function hasPermission(
  user: User | null | undefined,
  resource: string,
  action: Action,
): boolean {
  if (!user) return false;

  if (user.permissions) {
    const hasDirectPermission = user.permissions.some((p) => {
      if ('action' in p) {
        // Flat format
        return p.resource === resource && p.action === action;
      } else {
        // Grouped format
        return p.resource === resource && p.actions.includes(action);
      }
    });

    if (hasDirectPermission) return true;
  }

  // Check role-based permissions
  return (
    user.roles?.some((role) =>
      role.permissions?.some((p) => p.resource === resource && p.actions.includes(action)),
    ) || false
  );
}

export function hasAllPermissions(user: UserProfile | null, checks: PermissionCheck[]): boolean {
  return checks.every((check) => hasPermission(user, check.resource, check.action));
}

export function hasAnyPermission(user: UserProfile | null, checks: PermissionCheck[]): boolean {
  return checks.some((check) => hasPermission(user, check.resource, check.action));
}

export function hasRole(user: UserProfile | null, roleName: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.name === roleName);
}

export function hasAllRoles(user: UserProfile | null, roleNames: string[]): boolean {
  if (!user || !user.roles) return false;
  return roleNames.every((roleName) => user.roles!.some((role) => role.name === roleName));
}

export function hasAnyRole(user: UserProfile | null, roleNames: string[]): boolean {
  if (!user || !user.roles) return false;
  return roleNames.some((roleName) => user.roles!.some((role) => role.name === roleName));
}

export function getHighestRoleLevel(user: UserProfile | null): string | null {
  if (!user?.roles?.length) return null;
  return Math.max(...user.roles.map((r) => parseInt(r.name))).toString();
}

export function canPerformAction(
  user: UserProfile | null,
  resource: Resource,
  action: Action,
  data?: Record<string, unknown>,
): boolean {
  if (!user) return false;

  const permissions = getUserPermissions(user);
  const permission = permissions.find((p) => p.resource === resource && p.actions.includes(action));

  if (!permission) return false;

  return evaluateConditions(permission?.conditions, data, user);
}

function evaluateConditions(
  conditions: Record<string, unknown> | undefined,
  data: Record<string, unknown> | undefined,
  user: UserProfile | null,
): boolean {
  if (!conditions) return true;

  for (const [key, expectedValue] of Object.entries(conditions)) {
    if (key === 'ownerId') {
      if (data?.ownerId !== user?.id) return false;
    } else if (key === 'department') {
      if (user?.metadata?.department !== expectedValue) return false;
    } else if (key === 'status') {
      if (data?.status !== expectedValue) return false;
    }
  }
  return true;
}

export function getAllowedResources(user: UserProfile | null): Resource[] {
  const permissions = getUserPermissions(user);
  return [...new Set(permissions.map((p) => p.resource))];
}

/**
 * Get all actions user can perform on a resource
 */
export function getAllowedActions(user: UserProfile | null, resource: Resource): Action[] {
  const permissions = getUserPermissions(user);
  const resourcePermissions = permissions.filter((p) => p.resource === resource);

  const allActions = resourcePermissions.flatMap((p) => p.actions);
  return [...new Set(allActions)];
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(
  user: UserProfile | null,
  routePermissions: { resource: Resource; action: Action }[],
): boolean {
  return routePermissions.every((permission) =>
    hasPermission(user, permission.resource, permission.action),
  );
}
