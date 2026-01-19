import { permissionMap } from '../constants/permissions'

export function flattenPermissions() {
  return Object.entries(permissionMap).flatMap(([resource, actions]) =>
    actions.map((action) => ({
      resource,
      action,
      description: `${action} ${resource}`,
    })),
  )
}
