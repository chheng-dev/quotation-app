'use client'

import { PermissionGuard } from '@/src/components/permission-guard'

export default function CustomersPage() {
  return (
    <PermissionGuard resource="customers" action="read">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>
        <p>
          This page is only accessible to users with &quot;customers read&quot;
          permission.
        </p>
      </div>
    </PermissionGuard>
  )
}
