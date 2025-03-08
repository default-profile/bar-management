import { createAuthMiddleware } from 'better-auth/api';
import prisma from './prisma';
import { betterAuth } from 'better-auth';
import { APIError } from 'better-call';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';

export const auth = betterAuth({
	plugins: [
		emailOTP({
			disableSignUp: true,
			async sendVerificationOTP({ email, otp, type }) {
				console.log(email, otp, type);
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
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false,
			},
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
