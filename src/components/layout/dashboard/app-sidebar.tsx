import * as React from 'react'
import { NavMain } from '@/components/layout/dashboard/nav-main'
import { NavUser } from '@/components/layout/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { CommandIcon, Folder, UsersIcon } from 'lucide-react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  'use server'
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) redirect('/login')

  const navMain = [
    {
      title: 'Projects',
      url: '/dashboard',
      icon: <Folder />,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Mini Gallery</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session.user.name,
            email: session.user.email,
            avatar: '/avatars/shadcn.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
