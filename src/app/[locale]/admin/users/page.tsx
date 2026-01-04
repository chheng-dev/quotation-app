'use client'
import { useRouter } from 'next/navigation'

import { useUsers } from '@/src/hooks/use-user'

import PageLayout from '../shared/page-layout'
import TableUser from './table'

export default function UserPage() {
  const router = useRouter()
  const { data: userResponse, isLoading } = useUsers()
  return (
    <PageLayout
      title="User Management"
      btnLabel="New User"
      requiresAuth={{
        resource: 'users',
        action: 'read',
      }}
      onSubmit={() => router.push('/admin/users/new')}
    >
      <TableUser
        items={userResponse?.items || []}
        isLoading={!userResponse || isLoading}
      />
    </PageLayout>
  )
}
