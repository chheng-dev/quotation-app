# Permission-Based Access Control (RBAC) Implementation Guide

## Overview

This application uses a two-layer security approach:

1. **Authentication Layer (Middleware)**: Checks if user is logged in
2. **Authorization Layer (Page Components)**: Checks if user has specific permissions

## Why Both Layers?

- **Middleware**: Runs on Edge Runtime, can only check authentication (token exists)
- **Page Components**: Run in Node.js environment, can fetch full user data including permissions from database

## How to Protect Your Pages

### Method 1: PermissionGuard Component (Recommended)

Wrap your page content with the `PermissionGuard` component:

```tsx
'use client'

import { PermissionGuard } from '@/src/components/permission-guard'

export default function UserPage() {
  return (
    <PermissionGuard resource="users" action="read">
      <div>
        {/* Your page content here */}
        <h1>Users List</h1>
        {/* ... */}
      </div>
    </PermissionGuard>
  )
}
```

**Features:**

- ✅ Automatically redirects unauthorized users
- ✅ Shows loading spinner while checking permissions
- ✅ Prevents flash of unauthorized content
- ✅ Client-side protection (cannot be bypassed)

### Method 2: Multiple Permissions

For pages that require multiple permissions:

```tsx
'use client'

import { MultiplePermissionGuard } from '@/src/components/permission-guard'

export default function RolesPage() {
  return (
    <MultiplePermissionGuard
      permissions={[
        { resource: 'roles', action: 'read' },
        { resource: 'permissions', action: 'read' },
      ]}
      requireAll={false} // false = ANY, true = ALL
    >
      <div>
        <h1>Roles & Permissions</h1>
        {/* ... */}
      </div>
    </MultiplePermissionGuard>
  )
}
```

### Method 3: usePermissions Hook

For more complex conditional rendering:

```tsx
'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { usePermissions } from '@/src/hooks/use-permission'

export default function ComplexPage() {
  const { can, isLoading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !can('users', 'read')) {
      router.replace('/admin')
    }
  }, [can, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const canEdit = can('users', 'update')
  const canDelete = can('users', 'delete')

  return (
    <div>
      <h1>Users</h1>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  )
}
```

## Adding New Protected Routes

### Step 1: Define Route Permission

Edit `/src/lib/route-permissions.ts`:

```typescript
export const routePermissions: Record<string, RoutePermission> = {
  // ... existing routes
  '/admin/products': { resource: 'products', action: 'read' },
  '/admin/products/create': { resource: 'products', action: 'create' },
}
```

### Step 2: Protect the Page

In your page component:

```tsx
'use client'

import { PermissionGuard } from '@/src/components/permission-guard'

export default function ProductsPage() {
  return (
    <PermissionGuard resource="products" action="read">
      {/* Your content */}
    </PermissionGuard>
  )
}
```

### Step 3: Add to Sidebar (Optional)

Edit `/src/components/app-sidebar.tsx`:

```tsx
{
  title: "Products",
  url: "/admin/products",
  permission: { resource: "products", action: "read" },
}
```

## Permission Patterns

### Pattern 1: List/View Pages

```tsx
<PermissionGuard resource="users" action="read">
```

### Pattern 2: Create Pages

```tsx
<PermissionGuard resource="users" action="create">
```

### Pattern 3: Edit Pages

```tsx
<PermissionGuard resource="users" action="update">
```

### Pattern 4: Delete Actions

```tsx
{
  can('users', 'delete') && <button onClick={handleDelete}>Delete</button>
}
```

### Pattern 5: Settings Pages

```tsx
<MultiplePermissionGuard
  permissions={[
    { resource: "settings", action: "read" },
    { resource: "settings", action: "manage" }
  ]}
  requireAll={false}
>
```

## Testing Permissions

### 1. Check Your Current Permissions

Open browser console on any page:

```javascript
// Your permissions will be logged by the sidebar
// Look for: "🔄 getUserPermissions - Transformed:"
```

### 2. Test Access Without Permission

1. Login with a user
2. Try to access a route directly (e.g., `/en/admin/users`)
3. You should be redirected to `/en/admin` if you don't have permission

### 3. Test Sidebar Visibility

1. Sidebar items should only show for routes you have permission for
2. Parent items hide if all children are inaccessible

## Common Issues & Solutions

### Issue 1: "Page is blank after login"

**Cause**: Permission check is redirecting you immediately.

**Solution**: Check that your user has the required permission in the database.

```sql
-- Check user permissions
SELECT u.email, p.resource, p.action
FROM users u
JOIN user_permissions up ON u.id = up.user_id
JOIN permissions p ON up.permission_id = p.id
WHERE u.email = 'your@email.com';
```

### Issue 2: "Can still access page by typing URL"

**Cause**: Page is not wrapped with PermissionGuard.

**Solution**: Add PermissionGuard to the page:

```tsx
'use client'
import { PermissionGuard } from '@/src/components/permission-guard'

export default function YourPage() {
  return (
    <PermissionGuard resource="resource_name" action="read">
      {/* content */}
    </PermissionGuard>
  )
}
```

### Issue 3: "Sidebar shows item but page redirects"

**Cause**: Mismatch between sidebar permission and page permission.

**Solution**: Make sure both use the same permission:

```tsx
// In app-sidebar.tsx
{
  title: "Users",
  url: "/admin/users",
  permission: { resource: "users", action: "read" }, // ✅ Match
}

// In page.tsx
<PermissionGuard resource="users" action="read"> // ✅ Match
```

### Issue 4: "Loading spinner shows indefinitely"

**Cause**: Permission hook not loading properly.

**Solution**: Check that:

1. User is authenticated (has valid token)
2. `/api/auth/me` endpoint is working
3. Browser console for errors

## Permission Hierarchy

```
Resource: "users"
├── action: "read"    → View users list
├── action: "create"  → Create new user
├── action: "update"  → Edit existing user
└── action: "delete"  → Delete user
```

## Best Practices

1. **Always wrap pages with PermissionGuard** - Don't rely on sidebar hiding alone
2. **Use specific actions** - Don't use generic "access" action
3. **Consistent naming** - Use same resource/action names everywhere
4. **Test thoroughly** - Test with users who don't have permissions
5. **Graceful degradation** - Hide buttons/features user can't use

## Example: Complete Protected Page

```tsx
'use client'

import { PermissionGuard } from '@/src/components/permission-guard'
import { Button } from '@/src/components/ui/button'
import { usePermissions } from '@/src/hooks/use-permission'

export default function UsersPage() {
  const { can } = usePermissions()

  const canCreate = can('users', 'create')
  const canUpdate = can('users', 'update')
  const canDelete = can('users', 'delete')

  return (
    <PermissionGuard resource="users" action="read">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          {canCreate && <Button>Create User</Button>}
        </div>

        <table>
          {/* users list */}
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>
                  {canUpdate && <Button>Edit</Button>}
                  {canDelete && <Button variant="destructive">Delete</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PermissionGuard>
  )
}
```

## Security Notes

⚠️ **Important**:

1. **Client-side checks are for UX only** - They hide UI elements but don't prevent API calls
2. **Always validate permissions on the server** - In your API routes, check permissions again
3. **Never trust client-side data** - Always verify on the backend

Example API route protection:

```typescript
// /app/api/users/route.ts
import { canPerformAction } from '@/src/app/utils/permissions'
import { getTokenFromCookiesWithUser } from '@/src/lib/jwt-server'

export async function GET(req: Request) {
  const result = await getTokenFromCookiesWithUser()

  if (!result?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check permission
  if (!canPerformAction(result.user, 'users', 'read')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ... your logic
}
```

## Resources

- Permission Guard Component: `/src/components/permission-guard.tsx`
- Permission Utilities: `/src/app/utils/permissions.ts`
- Permission Hook: `/src/hooks/use-permission.ts`
- Route Permissions Config: `/src/lib/route-permissions.ts`
- Sidebar Filtering: `/src/app/utils/sidebar-permissions.ts`
