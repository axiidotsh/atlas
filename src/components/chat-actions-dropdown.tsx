'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import {
  EllipsisIcon,
  FolderPlusIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';

interface ChatActionsDropdownProps {
  chatTitle: string;
  onConvertToProject?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
}

export const ChatActionsDropdown = ({
  chatTitle,
  onConvertToProject,
  onDelete,
  onRename,
}: ChatActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className="cursor-pointer" showOnHover>
          <EllipsisIcon />
          <span className="sr-only">Open actions for {chatTitle}</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuItem onSelect={onRename}>
          <PencilIcon />
          Rename chat
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onConvertToProject}>
          <FolderPlusIcon />
          Convert to project
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon />
          Delete chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
