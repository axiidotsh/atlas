'use client';

import { useRequestPasswordReset } from '@/app/(auth)/hooks/use-request-password-reset';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const requestPasswordReset = useRequestPasswordReset();
  const { control, handleSubmit, reset } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema as never) as never,
    defaultValues: { email: '' },
  });

  function onSubmit(values: ForgotPasswordValues) {
    requestPasswordReset.mutate(values, {
      onSuccess: () => reset(),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={requestPasswordReset.isPending}
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
          disabled={requestPasswordReset.isPending}
        >
          {requestPasswordReset.isPending && <Spinner />}
          {requestPasswordReset.isPending ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        Remember your password?{' '}
        <Link
          href="/sign-in"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
