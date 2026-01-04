import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { roles } from './roles'
import { users } from './user'

export const userRoles = pgTable(
  'user_roles',
  {
    userId: integer('user_id').references(() => users.id),
    roleId: integer('role_id').references(() => roles.id),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.roleId),
  }),
)

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}))
