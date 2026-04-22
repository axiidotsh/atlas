'use client';

import { GoogleLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema as never) as never,
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(values: SignInValues) {
    console.log(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to continue to your account
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Button type="button" variant="outline" className="w-full">
          <GoogleLogo className="size-4" />
          Continue with Google
        </Button>
        <div className="relative flex items-center">
          <div className="flex-1 border-t" />
          <span className="text-muted-foreground px-3 text-xs font-medium">
            OR
          </span>
          <div className="flex-1 border-t" />
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
                  aria-invalid={fieldState.invalid}
                  className="bg-background dark:bg-input/30"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={fieldState.invalid}
                  className="bg-background dark:bg-input/30"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
