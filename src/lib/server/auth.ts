import prisma from './prisma';
import { betterAuth } from 'better-auth';
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
});
