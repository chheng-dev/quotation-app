import { eq, inArray } from 'drizzle-orm'

import db from '../lib/db'
import {
  Role,
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from '../lib/db/schema'
import { BaseModel } from './baseModel'

export class RoleModel extends BaseModel<Role> {
  constructor() {
    super(roles)
  }

  async getRolePermissions(roleIds: number[]) {
    return db
      .select({
        resource: permissions.resource,
        action: permissions.action,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(inArray(rolePermissions.roleId, roleIds))
  }

  async attachRoleToUser(userId: number, roleId: number) {
    return db.insert(userRoles).values({ userId, roleId }).onConflictDoNothing()
  }

  async attachPermissionToRole(roleId: number, permissionId: number) {
    return db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .onConflictDoNothing()
  }
}

export const roleModel = new RoleModel()
