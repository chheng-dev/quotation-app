import db from '..'
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from '../schema'

export async function superadmin() {
  console.log('Seeding superadmin user...')

  const [superadmin] = await db
    .insert(roles)
    .values({ name: 'superadmin', description: 'Super Administrator' })
    .onConflictDoNothing()
    .returning()

  const rolesToSeed = [
    { name: 'admin', description: 'Administrator' },
    { name: 'editor', description: 'Content Editor' },
    { name: 'viewer', description: 'Content Viewer' },
  ]

  for (const r of rolesToSeed) {
    await db.insert(roles).values(r).onConflictDoNothing()
  }

  const perms = [
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
    { resource: 'roles', action: 'create' },
    { resource: 'roles', action: 'read' },
    { resource: 'roles', action: 'update' },
    { resource: 'roles', action: 'delete' },
  ]

  const createdPerms = await db
    .insert(permissions)
    .values(perms)
    .onConflictDoNothing()
    .returning()

  // SUPER ADMIN gets All permissions
  for (const p of createdPerms) {
    await db
      .insert(rolePermissions)
      .values({ roleId: superadmin.id, permissionId: p.id })
      .onConflictDoNothing()
  }

  // Create initial superadmin user
  const [adminUser] = await db
    .insert(users)
    .values({
      name: 'Dexter Admin',
      email: 'dex@gmail.com',
      code: 'SUPERADMIN001',
      passwordHash:
        '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D6Pz3hXhN3kq6j0O5f6z1Z5K1G6eW', // bcrypt hash for 'dex12345'
      passwordConfirmation:
        '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D6Pz3hXhN3kq6j0O5f6z1Z5K1G6eW',
      isActive: true,
      isVerified: true,
      phoneNumber: '123-456-7890',
      dob: new Date('1990-01-01'),
    })
    .onConflictDoNothing()
    .returning()

  await db
    .insert(userRoles)
    .values({ userId: adminUser.id, roleId: superadmin.id })
    .onConflictDoNothing()

  console.log('Superadmin user seeded.')
}
