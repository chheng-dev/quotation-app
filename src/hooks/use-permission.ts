import { useMemo } from 'react'

import {
  canPerformAction,
  getAllowedActions,
  getAllowedResources,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from '../app/utils/permissions'
import { Action, PermissionCheck, Resource, UserProfile } from '../types/rbac'
import { useAuth } from './use-auth'

export function usePermissions() {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Get user permissions
  const permissions = useMemo(() => {
    return getUserPermissions(user as UserProfile | null)
  }, [user])

  // Permission check functions
  const can = (
    resource: Resource,
    action: Action,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>,
  ): boolean => {
    if (!isAuthenticated) return false
    return canPerformAction(user as UserProfile | null, resource, action, data)
  }

  const canAll = (checks: PermissionCheck[]): boolean => {
    if (!isAuthenticated) return false
    return hasAllPermissions(user as UserProfile | null, checks)
  }

  const canAny = (checks: PermissionCheck[]): boolean => {
    if (!isAuthenticated) return false
    return hasAnyPermission(user as UserProfile | null, checks)
  }

  const checkPermission = (resource: Resource, action: Action): boolean => {
    if (!isAuthenticated) return false
    return hasPermission(user as UserProfile | null, resource, action)
  }

  // Role check functions
  const hasRoleAccess = (roleName: string): boolean => {
    if (!isAuthenticated) return false
    return hasRole(user as UserProfile | null, roleName)
  }

  const hasAnyRoleAccess = (roleNames: string[]): boolean => {
    if (!isAuthenticated) return false
    return hasAnyRole(user as UserProfile | null, roleNames)
  }

  // Permission data getters
  const allowedResources = useMemo(() => {
    return getAllowedResources(user as UserProfile | null)
  }, [user])

  const getAllowedResourceActions = (resource: Resource): Action[] => {
    return getAllowedActions(user as UserProfile | null, resource)
  }

  // Check access with multiple conditions
  const canAccess = (
    requiredPermissions?: PermissionCheck[],
    requiredAnyPermissions?: PermissionCheck[],
    requiredRoles?: string[],
    requiredAnyRoles?: string[],
  ): boolean => {
    if (!isAuthenticated) return false

    // Check permissions
    if (requiredPermissions?.length && !canAll(requiredPermissions)) {
      return false
    }

    if (requiredAnyPermissions?.length && !canAny(requiredAnyPermissions)) {
      return false
    }

    // Check roles
    if (requiredRoles?.length && !requiredRoles.every(hasRoleAccess)) {
      return false
    }

    if (requiredAnyRoles?.length && !hasAnyRoleAccess(requiredAnyRoles)) {
      return false
    }

    return true
  }

  return {
    // State
    user,
    isLoading,
    isAuthenticated,

    // Permission data
    permissions,
    roles: user?.roles || [],
    allowedResources,

    // Permission checks
    can,
    canAll,
    canAny,
    checkPermission,
    canAccess,
    canPerformAction,

    // Role checks
    hasRole: hasRoleAccess,
    hasAnyRole: hasAnyRoleAccess,

    // Permission utilities
    getAllowedResourceActions,
  }
}
