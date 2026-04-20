'use client';

import { ChatActionsDropdown } from '@/components/chat-actions-dropdown';
import { Button } from '@/components/ui/button';
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
import { getStandardConversations } from '@/mock-data/conversations';
import type { MockStandardConversation } from '@/mock-data/types';
import { cn } from '@/utils/utils';
import {
  CircleGaugeIcon,
  ClipboardListIcon,
  ImagePlusIcon,
  MessageCirclePlusIcon,
  PanelLeftIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { PlaceholderLogo } from './icons';
import { SearchBar } from './search-bar';
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [chatQuery, setChatQuery] = React.useState('');
  const { open, setOpen, setOpenMobile } = useSidebar();

  const pathname = usePathname();
  const chats = getStandardConversations();

  const transitionClassname = `transition-opacity duration-200 ease-out ${
    open ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  function isNavItemActive(href: string) {
    if (href === '/chat') {
      return pathname === href;
    }
    return pathname.startsWith(href);
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
          <div className={cn('mb-2 px-2 pb-1', transitionClassname)}>
            <SearchBar
              value={chatQuery}
              onChange={setChatQuery}
              placeholder="Search your chats..."
              variant="ghost"
              size="sm"
              containerClassName="pl-0"
            />
          </div>
        </SidebarGroup>
        {/* chats */}
        <SidebarGroup className={cn('pt-0', transitionClassname)}>
          <SidebarMenu>
            {chats.map((chat) => (
              <ChatMenuItem
                key={chat.id}
                chat={chat}
                isActive={isNavItemActive(`/chat/${chat.id}`)}
                onNavigate={handleNavigate}
              />
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

interface ChatMenuItemProps {
  chat: MockStandardConversation;
  isActive: boolean;
  onNavigate: () => void;
}

function ChatMenuItem({ chat, isActive, onNavigate }: ChatMenuItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const shouldKeepInputFocusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isEditing]);

  return (
    <SidebarMenuItem>
      {isEditing ? (
        <div className="bg-sidebar-accent text-sidebar-accent-foreground relative flex h-8 w-full items-center overflow-hidden rounded-md p-2 pr-9 text-sm">
          <input
            ref={inputRef}
            defaultValue={chat.title}
            className="block w-full truncate bg-transparent p-0 text-sm outline-none"
            onBlur={() => setIsEditing(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.preventDefault();
                setIsEditing(false);
              }
            }}
          />
          <Button
            variant="destructive"
            size="icon-xs"
            className="absolute top-1/2 right-1 -translate-y-1/2"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsEditing(false)}
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href={`/chat/${chat.id}`} onClick={onNavigate}>
              <span>{chat.title}</span>
            </Link>
          </SidebarMenuButton>
          <ChatActionsDropdown
            chatTitle={chat.title}
            onCloseAutoFocus={(event) => {
              if (!shouldKeepInputFocusedRef.current) {
                return;
              }

              event.preventDefault();
              shouldKeepInputFocusedRef.current = false;

              requestAnimationFrame(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
              });
            }}
            onRename={() => {
              shouldKeepInputFocusedRef.current = true;
              setIsEditing(true);
            }}
          />
        </>
      )}
    </SidebarMenuItem>
  );
}
