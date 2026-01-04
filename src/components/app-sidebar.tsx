/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'

import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from '@tabler/icons-react'
import { BookOpen, Settings2, SettingsIcon, UsersIcon } from 'lucide-react'

import { filterSidebarItems } from '../app/utils/sidebar-permissions'
import { useAuth } from '../hooks/use-auth'
import { usePermissions } from '../hooks/use-permission'
import { NavDocuments } from './nav-documents'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from './ui/sidebar'

const getSidebarData = () => ({
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'User Management',
      url: '#',
      icon: UsersIcon,
      permission: { resource: 'users', action: 'read' },
      items: [
        {
          title: 'Users',
          url: '/admin/users',
          permission: { resource: 'users', action: 'read' },
        },
        {
          title: 'Customers',
          url: '/admin/customers',
          permission: { resource: 'customers', action: 'read' },
        },
        {
          title: 'Contact Person',
          url: '/admin/contact-person',
          permission: { resource: 'contacts', action: 'read' },
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
      permission: { resource: 'roles', action: 'read' },
      items: [
        {
          title: 'Roles',
          url: '/admin/roles',
          permission: { resource: 'roles', action: 'read' },
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'System Settings',
      url: '#',
      icon: Settings2,
      permission: { resource: 'settings', action: 'read' },
      items: [
        {
          title: 'General',
          url: '/settings/general',
          permission: { resource: 'settings', action: 'read' },
        },
        {
          title: 'Team',
          url: '/settings/team',
          permission: { resource: 'settings', action: 'manage' },
        },
        {
          title: 'Billing',
          url: '/settings/billing',
          permission: { resource: 'billing', action: 'read' },
        },
        {
          title: 'Limits',
          url: '/settings/limits',
          permission: { resource: 'settings', action: 'manage' },
        },
      ],
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      url: '#',
      permission: { resource: 'capture', action: 'read' },
      items: [
        {
          title: 'Active Proposals',
          url: '/capture/active',
          permission: { resource: 'proposals', action: 'read' },
        },
        {
          title: 'Archived',
          url: '/capture/archived',
          permission: { resource: 'proposals', action: 'read' },
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      permission: { resource: 'proposals', action: 'read' },
      items: [
        {
          title: 'Active Proposals',
          url: '/proposals/active',
          permission: { resource: 'proposals', action: 'read' },
        },
        {
          title: 'Archived',
          url: '/proposals/archived',
          permission: { resource: 'proposals', action: 'read' },
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      permission: { resource: 'prompts', action: 'read' },
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings,
      permission: { resource: 'settings', action: 'read' },
    },
    {
      title: 'Get Help',
      url: '/help',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '/search',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '/data-library',
      icon: IconDatabase,
      permission: { resource: 'data', action: 'read' },
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: IconReport,
      permission: { resource: 'reports', action: 'read' },
    },
    {
      name: 'Word Assistant',
      url: '/word-assistant',
      icon: IconFileWord,
      permission: { resource: 'assistant', action: 'use' },
    },
  ],
})
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    id: number
    name: string
    email: string
    roles?: number[]
    permissions?: { resource: string; action: string }[]
  } | null
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { user: authUser } = useAuth()
  const { user: permUser, canPerformAction, isLoading } = usePermissions()

  const filteredData = React.useMemo(() => {
    const data = getSidebarData()

    return {
      user: authUser
        ? {
          name: authUser.name,
          email: authUser.email,
          avatar: '/avatars/shadcn.jpg',
        }
        : data.user,
      navMain: filterSidebarItems(
        data.navMain,
        permUser as any,
        canPerformAction,
      ),
      navClouds: filterSidebarItems(
        data.navClouds,
        permUser as any,
        canPerformAction,
      ),
      navSecondary: filterSidebarItems(
        data.navSecondary,
        permUser as any,
        canPerformAction,
      ),
      documents: filterSidebarItems(
        data.documents,
        permUser as any,
        canPerformAction,
      ),
    }
  }, [authUser, permUser, canPerformAction])

  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="h-10" />
        </SidebarFooter>
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredData.navMain as any} label="Platform" />
        <NavMain items={filteredData.navClouds as any} label="Capture" />
        <NavDocuments items={filteredData.documents as any} />
        <NavSecondary
          items={filteredData.navSecondary as any}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={filteredData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
