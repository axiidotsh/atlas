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

const signUpSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { control, handleSubmit } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema as never) as never,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: SignUpValues) {
    console.log(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Get started in less than a minute
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
            name="fullName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>Full name</FieldLabel>
                <Input
                  {...field}
                  autoComplete="name"
                  placeholder="Jane Doe"
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
                <FieldLabel>Password</FieldLabel>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>Confirm password</FieldLabel>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
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
            Create account
          </Button>
        </form>
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
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
