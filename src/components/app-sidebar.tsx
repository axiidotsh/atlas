'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/utils/utils';
import {
  CircleGaugeIcon,
  ClipboardListIcon,
  ImagePlusIcon,
  PanelLeftIcon,
  SquarePenIcon,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { PlaceholderLogo } from './icons';
import { UserMenu } from './user-menu';

const NAV_ITEMS = [
  {
    label: 'New Chat',
    href: '/chat',
    icon: SquarePenIcon,
  },
  {
    label: 'Metrics',
    href: '/metrics',
    icon: CircleGaugeIcon,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: ClipboardListIcon,
  },
  {
    label: 'Studio',
    href: '/studio',
    icon: ImagePlusIcon,
  },
];

const CHATS = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  title: `Chat ${i + 1}`,
}));

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar();

  const transitionClassname = `transition-opacity duration-200 ease-out ${
    open ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <div className="flex items-center">
              <SidebarMenuButton
                onClick={() => {
                  if (!open) {
                    setOpen(true);
                  }
                }}
                className={cn(
                  'group/header min-w-0 flex-1',
                  open && 'bg-transparent!'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="relative -ml-0.25 size-4.5 shrink-0">
                    <PlaceholderLogo
                      className={cn(
                        'absolute inset-0 transition-opacity duration-200',
                        !open && 'group-hover/header:opacity-0'
                      )}
                    />
                    <PanelLeftIcon
                      className={cn(
                        'absolute inset-0 transition-opacity duration-200',
                        open
                          ? 'opacity-0'
                          : 'opacity-0 group-hover/header:opacity-100'
                      )}
                    />
                  </div>
                  <span className={cn(transitionClassname)}>Atlas</span>
                </div>
              </SidebarMenuButton>
              <div
                className={cn(
                  'overflow-hidden transition-[width,opacity] duration-200 ease-out',
                  open ? 'ml-2 w-8 opacity-100' : 'w-0 opacity-0'
                )}
              >
                <SidebarTrigger className="cursor-pointer" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* nav items */}
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((navItem) => (
              <SidebarMenuItem key={navItem.label}>
                <SidebarMenuButton asChild>
                  <Link href={navItem.href}>
                    <navItem.icon />
                    <span className={cn(transitionClassname)}>
                      {navItem.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* chats */}
        <SidebarGroup className={cn(transitionClassname)}>
          <SidebarGroupLabel className="mt-0!">Your Chats</SidebarGroupLabel>
          <SidebarMenu>
            {CHATS.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${chat.id}`}>
                    <span>{chat.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
