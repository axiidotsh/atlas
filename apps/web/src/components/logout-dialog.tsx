'use client';

import { logoutDialogOpenAtom, sessionKeyAtom } from '@/atoms/ui-atoms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useSignOut } from '@/hooks/use-sign-out';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';

export const LogoutDialog = () => {
  const [isOpen, setIsOpen] = useAtom(logoutDialogOpenAtom);
  const setSessionKey = useSetAtom(sessionKeyAtom);
  const queryClient = useQueryClient();
  const { mutate: signOut, isPending } = useSignOut();

  function handleLogout() {
    signOut();
    setSessionKey((k) => k + 1);
    queryClient.clear();
    localStorage.clear();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log out</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : null}
            {isPending ? 'Logging out...' : 'Log out'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
