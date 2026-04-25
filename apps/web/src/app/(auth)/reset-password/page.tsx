'use client';

import { useResetPassword } from '@/app/(auth)/hooks/use-reset-password';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const token = searchParams.get('token') ?? '';
  const hasToken = token.length > 0;

  const { control, handleSubmit, reset } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema as never) as never,
    defaultValues: { password: '', confirmPassword: '' },
  });

  function onSubmit(values: ResetPasswordValues) {
    if (!hasToken) {
      toast.error('Password reset link is invalid or expired.');
      return;
    }

    resetPassword.mutate(
      {
        newPassword: values.password,
        token,
      },
      {
        onSuccess: () => reset(),
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <p className="text-muted-foreground text-sm">
          Choose a strong password you haven&apos;t used before
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>New password</FieldLabel>
              <PasswordInput
                {...field}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                disabled={resetPassword.isPending || !hasToken}
                aria-invalid={fieldState.invalid}
                className="bg-background dark:bg-input/30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Confirm new password</FieldLabel>
              <PasswordInput
                {...field}
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                disabled={resetPassword.isPending || !hasToken}
                aria-invalid={fieldState.invalid}
                className="bg-background dark:bg-input/30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={resetPassword.isPending || !hasToken}
        >
          {resetPassword.isPending && <Spinner />}
          {resetPassword.isPending ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        Back to{' '}
        <Link
          href="/sign-in"
          className="text-primary font-medium hover:underline"
        >
          sign in
        </Link>
      </p>
    </div>
  );
}
