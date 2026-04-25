import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, lastLoginMethod } from 'better-auth/plugins';
import { adminAc, userAc } from 'better-auth/plugins/admin/access';
import { db } from './db';
import { Role } from './db/generated/client';
import { emailService } from './services/email';

const RESET_PASSWORD_EXPIRY = 30 * 60; // 30 minutes
const EMAIL_VERIFICATION_EXPIRY = 24 * 60 * 60; // 24 hours
const SESSION_CACHE_EXPIRY = 2 * 60 * 60; // 2 hours

function getVerificationUrl(url: string) {
  const verificationUrl = new URL(url);
  verificationUrl.searchParams.set('callbackURL', process.env.APP_URL!);
  return verificationUrl.toString();
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.APP_URL!],
  plugins: [
    lastLoginMethod(),
    admin({
      defaultRole: Role.USER,
      adminRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      roles: {
        [Role.USER]: userAc,
        [Role.ADMIN]: adminAc,
        [Role.SUPER_ADMIN]: adminAc,
      },
    }),
  ],
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CACHE_EXPIRY,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_EXPIRY,
    sendResetPassword: async ({ user, token }) => {
      const url = `${process.env.APP_URL}/reset-password?token=${token}`;
      await emailService.sendPasswordResetEmail(user.email, user.name, url);
    },
    onPasswordReset: async ({ user }) => {
      await emailService.sendPasswordResetSuccessEmail(
        user.email,
        user.name,
        user.id
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: EMAIL_VERIFICATION_EXPIRY,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        getVerificationUrl(url)
      );
    },
  },
});
