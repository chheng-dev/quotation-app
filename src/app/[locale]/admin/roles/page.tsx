'use client'
import PageLayout from '../shared/page-layout'

export default function RolesPage() {
  return (
    <PageLayout
      title="Role Page"
      btnLabel="New Role"
      requiresAuth={{
        resource: 'roles',
        action: 'read',
      }}
    >
      <h1>Role page</h1>
    </PageLayout>
  )
}
