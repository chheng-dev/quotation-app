import { table } from 'console'
import { relations } from 'drizzle-orm'
import {
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

import { rolePermissions } from './role_permissions'

export const permissions = pgTable(
  'permissions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    resource: varchar('resource', { length: 100 }).notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    resourceActionUnique: uniqueIndex('resource_action_unique').on(
      table.resource,
      table.action,
    ),
  }),
)

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}))

export type Permission = typeof permissions.$inferSelect
export type NewPermission = typeof permissions.$inferInsert
