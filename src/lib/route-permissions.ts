/**
 * Route-to-permission mapping
 * Define which permissions are required for specific routes
 */

export interface RoutePermission {
  resource: string;
  action: string;
}

export const routePermissions: Record<string, RoutePermission> = {
  // User Management
  '/admin/users': { resource: 'users', action: 'read' },
  '/admin/customers': { resource: 'customers', action: 'read' },
  '/admin/contact-person': { resource: 'contacts', action: 'read' },

  // Settings
  '/roles': { resource: 'roles', action: 'read' },

  // System Settings
  '/settings/general': { resource: 'settings', action: 'read' },
  '/settings/team': { resource: 'settings', action: 'manage' },
  '/settings/billing': { resource: 'billing', action: 'read' },
  '/settings/limits': { resource: 'settings', action: 'manage' },

  // Capture
  '/capture/active': { resource: 'proposals', action: 'read' },
  '/capture/archived': { resource: 'proposals', action: 'read' },

  // Proposals
  '/proposals/active': { resource: 'proposals', action: 'read' },
  '/proposals/archived': { resource: 'proposals', action: 'read' },

  // Documents
  '/data-library': { resource: 'data', action: 'read' },
  '/reports': { resource: 'reports', action: 'read' },
  '/word-assistant': { resource: 'assistant', action: 'use' },

  // Settings
  '/settings': { resource: 'settings', action: 'read' },
};

/**
 * Get required permission for a given path
 */
export function getRequiredPermission(path: string): RoutePermission | null {
  // Exact match first
  if (routePermissions[path]) {
    return routePermissions[path];
  }

  // Check for parent paths
  for (const [route, permission] of Object.entries(routePermissions)) {
    if (path.startsWith(route)) {
      return permission;
    }
  }

  return null;
}

/**
 * Public routes that don't require any permissions
 */
export const publicRoutes = [
  '/',
  '/help',
  '/search',
  '/admin', // Dashboard is accessible to all authenticated users
];

/**
 * Check if a route is public
 */
export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}
