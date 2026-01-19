'use client'
import { useRouter } from 'next/navigation'

import PageLayout from '../shared/page-layout'
import TableRole from './table'

export default function RolesPage() {
  const router = useRouter()

  return (
    <PageLayout
      title="Role Page"
      btnLabel="New Role"
      requiresAuth={{
        resource: 'roles',
        action: 'read',
      }}
      onSubmit={() => router.push('/admin/roles/new')}
    >
      <TableRole />
    </PageLayout>
  )
}
