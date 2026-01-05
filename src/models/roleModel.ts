import { eq, inArray, sql } from 'drizzle-orm'

import { db } from '../lib/db'
import {
  NewRole,
  Role,
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from '../lib/db/schema'
import { BaseModel } from './baseModel'

export type RoleWithPermissions = {
  name: string
  description?: string
  permissions: number[]
}

export class RoleModel extends BaseModel<Role> {
  constructor() {
    super(roles)
  }

  async getRolesWithPermissions() {
    const result = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        permissions: sql`
          COALESCE(
            json_agg(
              json_build_object(
                'id', ${permissions.id},
                'resource', ${permissions.resource},
                'action', ${permissions.action}
              )
            ) FILTER (WHERE permissions.id IS NOT NULL),
            '[]'
          )
        `.as('permissions'),
        totalPermissions: sql<number>`
          COUNT(${permissions.id})::int
        `.as('totalPermissions'),
      })
      .from(roles)
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .groupBy(roles.id)

    return result
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

  async createRoleWithPermissions(data: RoleWithPermissions) {
    const { name, description, permissions } = data

    return await db.transaction(async (tx) => {
      const role = await tx
        .insert(roles)
        .values({ name, description })
        .returning()
        .then((res) => res[0])

      if (!role) {
        throw new Error('Failed to create role')
      }

      if (permissions?.length) {
        await tx.insert(rolePermissions).values(
          permissions.map((permissionId) => ({
            roleId: role.id,
            permissionId,
          })),
        )
      }

      return role
    })
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
