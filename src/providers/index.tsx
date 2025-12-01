"use client";

import { ThemeProvider } from "next-themes";
import { IntlProvider } from "next-intl";
import QueryProvider from "./query-provider";
import AlertDialogProvider from "./alert-dialog-provider";

export function Provider({ children, locale, messages }: { children: React.ReactNode, locale: string, messages: Record<string, string> }) {

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem>
        <AlertDialogProvider>
          <QueryProvider>
            <IntlProvider locale={locale} messages={messages}>
              {children}
            </IntlProvider>
          </QueryProvider>
        </AlertDialogProvider>
    </ThemeProvider>
  );
}
