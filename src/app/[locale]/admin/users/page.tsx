'use client';
import { useRouter } from 'next/navigation';
import PageLayout from '../shared/page-layout';
import TableUser from './table';

export default function UserPage() {
  const router = useRouter();
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
      <TableUser />
    </PageLayout>
  );
}
