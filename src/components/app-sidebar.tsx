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
import { cn } from '@/utils/utils';
import {
  BlocksIcon,
  CircleGaugeIcon,
  ClipboardListIcon,
  ImagePlusIcon,
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
    icon: BlocksIcon,
  },
];

const CHATS = [
  { id: '1', title: 'Q2 launch checklist' },
  { id: '2', title: 'Fixing the auth callback bug' },
  {
    id: '3',
    title: 'Homepage hero copy ideas for the new marketing push',
  },
  { id: '4', title: 'Weekly metrics review' },
  {
    id: '5',
    title: 'Prisma migration rollback plan after the staging failure',
  },
  { id: '6', title: 'Drafting the customer update' },
  { id: '7', title: 'Design feedback for the sidebar' },
  {
    id: '8',
    title: 'Interview prep for the frontend role with Sarah',
  },
  { id: '9', title: 'Support reply for billing issue' },
  { id: '10', title: 'Campaign launch timing' },
  { id: '11', title: 'Refactor the reports page' },
  {
    id: '12',
    title: 'Onboarding flow edge cases from the latest user testing',
  },
  { id: '13', title: 'Call notes from Acme' },
  { id: '14', title: 'Ideas for the empty state' },
  {
    id: '15',
    title: 'Webhook retry investigation for the failed deliveries',
  },
  { id: '16', title: 'Release notes for v1.8.0' },
  {
    id: '17',
    title: 'Pricing page experiments and headline variants',
  },
  { id: '18', title: 'Planning next sprint' },
  { id: '19', title: 'Team retro follow-up' },
  {
    id: '20',
    title: 'Content calendar for April and the early May drafts',
  },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  const transitionClassname = `transition-opacity duration-200 ease-out ${
    open ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  function isNavItemActive(href: string) {
    if (href === '/chat') {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href;
  }

  function isChatActive(chatId: string) {
    return pathname === `/chat/${chatId}`;
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
      <SidebarContent>
        {/* nav items */}
        <SidebarGroup className="bg-sidebar sticky top-0 z-10">
          <SidebarMenu>
            {NAV_ITEMS.map((navItem) => (
              <SidebarMenuItem key={navItem.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavItemActive(navItem.href)}
                >
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
          <SidebarGroupLabel className="sticky mt-0!">
            Your Chats
          </SidebarGroupLabel>
          <SidebarMenu>
            {CHATS.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild isActive={isChatActive(chat.id)}>
                  <Link href={`/chat/${chat.id}`}>
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
