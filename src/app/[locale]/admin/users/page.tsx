"use client"

import { PermissionGuard } from "@/src/components/permission-guard";

export default function UserPage() {
  return (
    <PermissionGuard resource="users" action="read">
      <div>Admin Users Page</div>
    </PermissionGuard>
  );
}