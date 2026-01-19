import { eq, inArray, sql } from 'drizzle-orm'

import { db } from '../lib/db'
import {
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

  async findRoleWithPermissions(name: string) {
    return await db
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
      })
      .from(roles)
      .where(eq(roles.name, name))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .groupBy(roles.id)
      .then((res) => res[0])
  }

  async updateRoleWithPermissions(name: string, data: RoleWithPermissions) {
    const { name: newName, description, permissions: permissionIds } = data

    return await db.transaction(async (tx) => {
      // Find the role by name
      const existingRole = await tx
        .select()
        .from(roles)
        .where(eq(roles.name, name))
        .then((res) => res[0])

      if (!existingRole) {
        throw new Error('Role not found')
      }

      // Update role name and description
      const updatedRole = await tx
        .update(roles)
        .set({
          name: newName,
          description,
          updatedAt: sql`now()`,
        })
        .where(eq(roles.id, existingRole.id))
        .returning()
        .then((res) => res[0])

      if (!updatedRole) {
        throw new Error('Failed to update role')
      }

      // Delete all existing role_permissions for this role
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, updatedRole.id))

      // Insert new role_permissions if any
      if (permissionIds?.length) {
        await tx.insert(rolePermissions).values(
          permissionIds.map((permissionId) => ({
            roleId: updatedRole.id,
            permissionId,
          })),
        )
      }

      return updatedRole
    })
  }
}

export const roleModel = new RoleModel()
