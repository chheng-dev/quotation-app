'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePermissions } from '../hooks/use-permission';
import { useLocale } from 'next-intl';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallbackUrl?: string;
}

export function PermissionGuard({ children, resource, action, fallbackUrl }: PermissionGuardProps) {
  const { can, isLoading } = usePermissions();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading) {
      const hasPermission = can(resource, action);

      if (!hasPermission) {
        // Redirect to unauthorized page or fallback URL
        const redirectUrl = fallbackUrl || `/${locale}/unauthorized`;
        router.replace(redirectUrl);
      }
    }
  }, [isLoading, can, resource, action, router, locale, fallbackUrl]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-sm text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Don't render if no permission
  if (!can(resource, action)) {
    return null;
  }

  return <>{children}</>;
}

interface MultiplePermissionGuardProps {
  children: React.ReactNode;
  permissions: Array<{ resource: string; action: string }>;
  requireAll?: boolean; // If true, requires ALL permissions. If false, requires ANY permission
  fallbackUrl?: string;
}

export function MultiplePermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallbackUrl,
}: MultiplePermissionGuardProps) {
  const { can, isLoading } = usePermissions();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading) {
      let hasPermission: boolean;

      if (requireAll) {
        // Check if user has ALL permissions
        hasPermission = permissions.every((p) => can(p.resource, p.action));
      } else {
        // Check if user has ANY permission
        hasPermission = permissions.some((p) => can(p.resource, p.action));
      }

      if (!hasPermission) {
        const redirectUrl = fallbackUrl || `/${locale}/unauthorized`;
        router.replace(redirectUrl);
      }
    }
  }, [isLoading, can, permissions, requireAll, router, locale, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-sm text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  let hasPermission: boolean;
  if (requireAll) {
    hasPermission = permissions.every((p) => can(p.resource, p.action));
  } else {
    hasPermission = permissions.some((p) => can(p.resource, p.action));
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
