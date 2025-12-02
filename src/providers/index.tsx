'use client';

import { ThemeProvider } from 'next-themes';
import { IntlProvider } from 'next-intl';
import QueryProvider from './query-provider';
import AlertDialogProvider from './alert-dialog-provider';
import { AuthProvider } from '@/src/components/providers/auth-provider';
import { Toaster } from 'sonner';

export function Provider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertDialogProvider>
        <QueryProvider>
          <AuthProvider>
            <IntlProvider locale={locale} messages={messages}>
              {children}
              <Toaster position="top-right" richColors />
            </IntlProvider>
          </AuthProvider>
        </QueryProvider>
      </AlertDialogProvider>
    </ThemeProvider>
  );
}
