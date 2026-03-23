'use client'

import * as React from 'react'

import { NavDocuments } from '@/components/share/nav-documents'
import { NavMain } from '@/components/share/nav-main'
import { NavSecondary } from '@/components/share/nav-secondary'
import { NavUser } from '@/components/share/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  Menu01Icon,
  ChartHistogramIcon,
  Folder01Icon,
  UserGroupIcon,
  CommandIcon,
} from '@hugeicons/core-free-icons'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Projects',
      url: '/admin',
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    {
      title: 'Categories',
      url: '/admin/categories',
      icon: <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <HugeiconsIcon
                  icon={CommandIcon}
                  strokeWidth={2}
                  className="size-5!"
                />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
