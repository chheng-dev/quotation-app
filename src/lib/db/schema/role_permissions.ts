import { integer, pgTable } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { permissions } from './permissions';
import { relations } from 'drizzle-orm';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: integer('role_id').references(() => roles.id),
    permissionId: integer('permission_id').references(() => permissions.id),
  },
  (table) => ({
    pk: [table.roleId, table.permissionId],
  }),
);

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
