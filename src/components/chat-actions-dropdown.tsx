'use client';

import { DeleteChatDialog } from '@/components/delete-chat-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

interface ChatActionsDropdownProps {
  chatTitle: string;
  onCloseAutoFocus?: React.ComponentProps<
    typeof DropdownMenuContent
  >['onCloseAutoFocus'];
  onDelete?: () => void;
  onRename?: () => void;
}

export const ChatActionsDropdown = ({
  chatTitle,
  onCloseAutoFocus,
  onDelete,
  onRename,
}: ChatActionsDropdownProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="cursor-pointer" showOnHover>
            <EllipsisIcon />
            <span className="sr-only">Open actions for {chatTitle}</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onCloseAutoFocus={onCloseAutoFocus}>
          <DropdownMenuItem onSelect={onRename}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteChatDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        chatTitle={chatTitle}
        onConfirm={() => onDelete?.()}
      />
    </>
  );
};
