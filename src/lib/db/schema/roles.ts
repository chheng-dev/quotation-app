import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { userRoles } from './user_roles';
import { rolePermissions } from './role_permissions';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  permissions: many(rolePermissions),
}));

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
