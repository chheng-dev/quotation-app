'use client'

import * as React from 'react'

import { usePathname } from 'next/navigation'

import { type Icon } from '@tabler/icons-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  const isUrlActive = (url: string) => {
    if (url === '#') return false

    const normalize = (p: string) => {
      const match = p.match(/^\/([a-z]{2})(\/.*)?$/)
      return match ? match[2] || '/' : p
    }

    const cleanedPathname = normalize(pathname)
    const cleanedUrl = normalize(url)

    return (
      cleanedPathname === cleanedUrl ||
      cleanedPathname.startsWith(cleanedUrl + '/') ||
      pathname === url
    )
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isUrlActive(item.url)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
