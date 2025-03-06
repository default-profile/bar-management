import { createAuthMiddleware } from 'better-auth/api';
import prisma from './prisma';
import { betterAuth } from 'better-auth';
import { APIError } from 'better-call';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
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
			if (ctx.path !== '/sign-in/email') return;

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
