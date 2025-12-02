'use client';

import { Button } from '@/src/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-lg text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator to request access.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => router.push(`/${locale}/admin`)}>Go to Dashboard</Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact your system administrator to request the necessary
            permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
