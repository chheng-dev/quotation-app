import db from '@/src/lib/db'
import { permissions } from '@/src/lib/db/schema'
import { flattenPermissions } from '@/src/utils/permission-utils'
import 'dotenv/config'

async function syncPermissions() {
  const defined = flattenPermissions()

  await db.transaction(async (tx) => {
    for (const perm of defined) {
      const name = `${perm.resource}:${perm.action}`
      await tx
        .insert(permissions)
        .values({
          name,
          resource: perm.resource,
          action: perm.action,
          description: perm.description,
        })
        .onConflictDoUpdate({
          target: permissions.name,
          set: {
            description: perm.description,
            updatedAt: new Date(),
          },
        })
      console.log(`  ✅ Synced: ${name}`)
    }
  })

  console.log('✨ Permissions sync completed successfully')
  process.exit(0)
}

syncPermissions().catch((err) => {
  console.error('❌ Permission sync failed', err)
  process.exit(1)
})
