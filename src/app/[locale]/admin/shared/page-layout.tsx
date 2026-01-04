import { Fragment } from 'react/jsx-runtime'

import { PermissionGuard } from '@/src/components/permission-guard'

import HeaderSection from './header-section'

interface PageLayoutProps {
  children: React.ReactNode
  requiresAuth: {
    resource: string
    action: string
  }
  btnLabel?: string
  title?: string
  onSubmit?: () => void
}

export default function PageLayout({
  children,
  requiresAuth,
  btnLabel,
  title,
  onSubmit,
}: PageLayoutProps) {
  return (
    <PermissionGuard
      resource={requiresAuth.resource}
      action={requiresAuth.action}
    >
      <Fragment>
        <HeaderSection
          title={title}
          showBackButton={true}
          btnLabel={btnLabel}
          onSubmit={onSubmit}
        />
        <div className="p-3">{children}</div>
      </Fragment>
    </PermissionGuard>
  )
}
