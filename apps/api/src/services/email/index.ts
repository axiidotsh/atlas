import { Resend } from 'resend';
import { logger } from '../../logger';
import {
  passwordResetEmailSchema,
  passwordResetSuccessEmailSchema,
  verificationEmailSchema,
  type EmailMetadata,
  type SendEmailParams,
} from './config';
import { PasswordResetEmail } from './templates/password-reset';
import { PasswordResetSuccessEmail } from './templates/password-reset-success';
import { VerificationEmail } from './templates/verification';

export const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;

const sendEmail = async (params: SendEmailParams, metadata: EmailMetadata) => {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    react: params.react,
    tags: [
      { name: 'type', value: metadata.emailType },
      ...(metadata.userId ? [{ name: 'user_id', value: metadata.userId }] : []),
    ],
  });

  if (error) {
    logger.error({
      event: 'email_send_error',
      emailType: metadata.emailType,
      to: metadata.recipientEmail,
      error: { name: error.name, message: error.message },
    });

    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
};

export const emailService = {
  async sendVerificationEmail(
    to: string,
    userName: string,
    verificationUrl: string,
    userId?: string
  ) {
    const input = verificationEmailSchema.parse({
      to,
      userName,
      verificationUrl,
    });

    return sendEmail(
      {
        to: input.to,
        subject: 'Verify your email address',
        react: VerificationEmail({
          userName: input.userName,
          verificationUrl: input.verificationUrl,
        }),
      },
      {
        emailType: 'verification',
        recipientEmail: input.to,
        userId,
      }
    );
  },
  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetUrl: string,
    userId?: string
  ) {
    const input = passwordResetEmailSchema.parse({
      to,
      userName,
      resetUrl,
    });

    return sendEmail(
      {
        to: input.to,
        subject: 'Reset your password',
        react: PasswordResetEmail({
          userName: input.userName,
          resetUrl: input.resetUrl,
        }),
      },
      {
        emailType: 'password_reset',
        recipientEmail: input.to,
        userId,
      }
    );
  },
  async sendPasswordResetSuccessEmail(
    to: string,
    userName: string,
    userId?: string
  ) {
    const input = passwordResetSuccessEmailSchema.parse({
      to,
      userName,
    });

    return sendEmail(
      {
        to: input.to,
        subject: 'Your password has been reset',
        react: PasswordResetSuccessEmail({
          userName: input.userName,
        }),
      },
      {
        emailType: 'password_reset_success',
        recipientEmail: input.to,
        userId,
      }
    );
  },
};
