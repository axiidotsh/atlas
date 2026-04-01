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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { MOCK_CHATS } from '@/mock-data/chats';
import { cn } from '@/utils/utils';
import {
  CircleGaugeIcon,
  ClipboardListIcon,
  ImagePlusIcon,
  MegaphoneIcon,
  MessageCirclePlusIcon,
  PanelLeftIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { PlaceholderLogo } from './icons';
import { UserMenu } from './user-menu';

const NAV_ITEMS = [
  {
    label: 'New Chat',
    href: '/chat',
    icon: MessageCirclePlusIcon,
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
    label: 'Creative Studio',
    href: '/studio',
    icon: ImagePlusIcon,
  },
  {
    label: 'Campaign Builder',
    href: '/campaign-builder',
    icon: MegaphoneIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const transitionClassname = `transition-opacity duration-200 ease-out ${
    open ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  function isNavItemActive(href: string) {
    return pathname === href;
  }

  function handleNavigate() {
    setOpenMobile(false);
  }

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
                  <div className="relative size-4.5 shrink-0">
                    <PlaceholderLogo
                      className={cn(
                        'absolute inset-0 -ml-0.5 size-5! transition-opacity duration-200',
                        !open && 'group-hover/header:opacity-0'
                      )}
                    />
                    <PanelLeftIcon
                      className={cn(
                        '-ml-0.125 absolute inset-0 transition-opacity duration-200',
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
                <SidebarTrigger className="hover:bg-accent! cursor-pointer" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* nav items */}
        <SidebarGroup className="bg-sidebar sticky top-0 z-10 pb-0">
          <SidebarMenu>
            {NAV_ITEMS.map((navItem) => (
              <SidebarMenuItem key={navItem.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavItemActive(navItem.href)}
                >
                  <Link href={navItem.href} onClick={handleNavigate}>
                    <navItem.icon />
                    <span className={cn(transitionClassname)}>
                      {navItem.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarGroupLabel
            className={cn('mt-4! truncate', transitionClassname)}
          >
            Your Chats
          </SidebarGroupLabel>
        </SidebarGroup>
        {/* chats */}
        <SidebarGroup className={cn('pt-0', transitionClassname)}>
          <SidebarMenu>
            {MOCK_CHATS.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavItemActive(`/chat/${chat.id}`)}
                >
                  <Link href={`/chat/${chat.id}`} onClick={handleNavigate}>
                    <span>{chat.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
