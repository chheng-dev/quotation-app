import { z } from 'zod'

export const permissionSchema = z.object({
  resource: z.string().min(1),
  action: z.enum(['create', 'read', 'update', 'delete', 'manage']),
})

const baseRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  description: z.string().optional(),
  permissions: z.array(permissionSchema).default([]),
})

export const roleCreateSchema = baseRoleSchema

export const roleUpdateSchema = baseRoleSchema.extend({
  id: z.union([z.string(), z.number()]),
})

// Types inferred from the Zod objects
export type Permission = z.infer<typeof permissionSchema>
export type RoleFormSchema = z.infer<typeof roleCreateSchema>
export type RoleUpdateFormSchema = z.infer<typeof roleUpdateSchema>
