/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Action,
  PermissionCheck,
  Resource,
  UserProfile,
} from '@/src/types/rbac'

export interface SidebarItem {
  title: string
  url: string
  icon?: React.ComponentType
  isActive?: boolean
  permission?: PermissionCheck
  items?: SidebarItem[]
  requiredPermissions?: PermissionCheck[]
  requiredAnyPermissions?: PermissionCheck[]
}

export function filterSidebarItems(
  items: SidebarItem[],
  user: UserProfile | null,
  canPerformAction: (
    user: UserProfile | null,
    resource: Resource,
    action: Action,
    data?: Record<string, any>,
  ) => boolean,
): SidebarItem[] {
  return items
    .map((item) => {
      const shouldShowItem = checkItemPermission(item, user, canPerformAction)
      if (!shouldShowItem) return null

      let filteredSubItems: SidebarItem[] | undefined
      if (item.items && item.items.length > 0) {
        filteredSubItems = filterSidebarItems(
          item.items,
          user,
          canPerformAction,
        )

        // Hide parent if all sub-items are filtered out
        if (filteredSubItems.length === 0) {
          return null
        }
      }

      return {
        ...item,
        items: filteredSubItems,
      }
    })
    .filter((item) => item !== null) as SidebarItem[]
}

function checkItemPermission(
  item: SidebarItem,
  user: UserProfile | null,
  canPerformAction: (
    user: UserProfile | null,
    resource: string,
    action: string,
    data?: Record<string, any>,
  ) => boolean,
): boolean {
  if (
    !item.permission &&
    !item.requiredPermissions &&
    !item.requiredAnyPermissions
  ) {
    return true
  }

  if (item.permission) {
    const hasPermission = canPerformAction(
      user,
      item.permission.resource,
      item.permission.action,
    )
    if (!hasPermission) return false
  }

  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    const hasAllPermissions = item.requiredPermissions.every((perm) =>
      canPerformAction(user, perm.resource, perm.action),
    )
    if (!hasAllPermissions) return false
  }

  if (item.requiredAnyPermissions && item.requiredAnyPermissions.length > 0) {
    const hasAnyPermission = item.requiredAnyPermissions.some((perm) =>
      canPerformAction(user, perm.resource, perm.action),
    )
    if (!hasAnyPermission) return false
  }

  return true
}

export function getActiveSidebarItem(
  items: SidebarItem[],
  pathname: string,
): SidebarItem | null {
  for (const item of items) {
    if (item.url === pathname || item.url === `#${pathname}`) {
      return item
    }

    if (item.items && item.items.length > 0) {
      const activeSubItem = getActiveSidebarItem(item.items, pathname)
      if (activeSubItem) {
        return item
      }
    }
  }
  return null
}
