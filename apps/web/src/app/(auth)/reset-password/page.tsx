'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
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
  const { control, handleSubmit } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema as never) as never,
    defaultValues: { password: '', confirmPassword: '' },
  });

  function onSubmit(values: ResetPasswordValues) {
    console.log(values);
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
                aria-invalid={fieldState.invalid}
                className="bg-background dark:bg-input/30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" className="w-full">
          Reset password
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
