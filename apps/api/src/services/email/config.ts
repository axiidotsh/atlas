import type { ReactElement } from 'react';
import { z } from 'zod';

export type EmailType =
  | 'verification'
  | 'password_reset'
  | 'password_reset_success';

const baseEmailSchema = {
  to: z.string().email('Invalid email address'),
  userName: z.string().min(1).max(100),
};

export const verificationEmailSchema = z.object({
  ...baseEmailSchema,
  verificationUrl: z.string().url(),
});

export const passwordResetEmailSchema = z.object({
  ...baseEmailSchema,
  resetUrl: z.string().url(),
});

export const passwordResetSuccessEmailSchema = z.object({
  ...baseEmailSchema,
});

export interface SendEmailParams {
  to: string;
  subject: string;
  react: ReactElement;
}

export interface EmailMetadata {
  emailType: EmailType;
  userId?: string;
  recipientEmail: string;
}
