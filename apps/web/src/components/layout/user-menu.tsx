'use client';

import { useSetAtom } from 'jotai';
import {
  Bell,
  ChevronsUpDown,
  CircleQuestionMarkIcon,
  CreditCard,
  LogOut,
  Monitor,
  Moon,
  Settings2Icon,
  SettingsIcon,
  Sun,
  SunMoon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { logoutDialogOpenAtom } from '@/atoms/ui-atoms';
import { LogoutDialog } from '@/components/logout-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';

type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeMenuOption {
  icon: typeof Sun;
  label: string;
  value: ThemeOption;
}

const THEME_OPTIONS: ThemeMenuOption[] = [
  {
    icon: Sun,
    label: 'Light',
    value: 'light',
  },
  {
    icon: Moon,
    label: 'Dark',
    value: 'dark',
  },
  {
    icon: Monitor,
    label: 'System',
    value: 'system',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join('');
}

export const UserMenu = () => {
  const { isMobile } = useSidebar();
  const { theme = 'system', setTheme } = useTheme();
  const setLogoutDialogOpen = useSetAtom(logoutDialogOpenAtom);
  const { user } = useUser();

  const userInitials = getInitials(user?.name || 'A') || 'U';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                {user?.image && (
                  <AvatarImage src={user.image} alt={user.name} />
                )}
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-sm:w-64"
            side={isMobile ? 'bottom' : 'right'}
            align={isMobile ? 'start' : 'end'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  {user?.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback className="rounded-full">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings2Icon />
                Personalization
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleQuestionMarkIcon />
                FAQs
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SunMoon />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as ThemeOption)}
                  >
                    {THEME_OPTIONS.map((option) => {
                      const Icon = option.icon;

                      return (
                        <DropdownMenuRadioItem
                          key={option.value}
                          value={option.value}
                        >
                          <Icon />
                          {option.label}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setLogoutDialogOpen(true)}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <LogoutDialog />
    </SidebarMenu>
  );
};
