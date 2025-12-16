'use client';

import { MultiplePermissionGuard } from '@/src/components/permission-guard';

export default function RolesPage() {
  return (
    <MultiplePermissionGuard
      permissions={[
        { resource: 'roles', action: 'read' },
        { resource: 'permissions', action: 'read' },
      ]}
      requireAll={false}
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>
        <p>
          This page requires either &quot;roles read&quot; OR &quot;permissions read&quot;
          permission.
        </p>
      </div>
    </MultiplePermissionGuard>
  );
}
