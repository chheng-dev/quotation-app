'use client'
import { useEffect } from 'react'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

import { AppSidebar } from '@/src/components/app-sidebar'
import { SiteHeader } from '@/src/components/site-header'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar'
import { useCurrentUser } from '@/src/hooks/use-current-user'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useCurrentUser()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, isLoading, router, locale])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
