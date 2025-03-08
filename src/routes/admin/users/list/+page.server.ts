import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ request }: PageServerLoadEvent) {
	const users = await prisma.user.findMany({ select: { name: true, email: true }, orderBy: { name: 'asc' } });
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return redirect(302, '/auth/login-admin');
	return { users: users.filter((user) => user.email !== session.user.email) };
}
