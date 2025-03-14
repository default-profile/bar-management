import { createAuthMiddleware } from 'better-auth/api';
import prisma from './prisma';
import { betterAuth } from 'better-auth';
import { APIError } from 'better-call';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, emailOTP } from 'better-auth/plugins';
import { sendOtp } from './utils';

export const auth = betterAuth({
	plugins: [
		admin(),
		emailOTP({
			disableSignUp: true,
			async sendVerificationOTP({ email, otp }) {
				try {
					await sendOtp(email, otp);
				} catch (error) {
					throw new APIError('INTERNAL_SERVER_ERROR', { message: 'Could not send otp' });
				}
			},
		}),
	],
	emailAndPassword: {
		enabled: true,
	},
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	user: {
		deleteUser: {
			enabled: true,
		},
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== '/sign-in/email-otp') return;

			const newSession = ctx.context.newSession;
			const referer = ctx.getHeader('referer');
			if (!referer) return;

			if (referer.endsWith('login') && newSession?.user.role !== 'user') {
				throw new APIError('BAD_REQUEST', { message: 'Invalid credentials' });
			}

			if (referer.endsWith('login-admin') && newSession?.user.role !== 'admin') {
				throw new APIError('BAD_REQUEST', { message: 'Invalid credentials' });
			}
		}),
	},
});
