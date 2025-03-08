import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ request }: PageServerLoadEvent) {
	const users = await prisma.user.findMany({ select: { name: true, email: true }, orderBy: { name: 'asc' } });
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return redirect(302, '/auth/login-admin');
	return { users: users.filter((user) => user.email !== session.user.email) };
}

export const actions: Actions = {
	addUser: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
		if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');

		const newSession = await auth.api.signUpEmail({
			body: { name: String(name), email: String(email), password: 'Default@12345' },
		});

		if (newSession) return { success: true };
		else return { success: false, message: 'Something went wrong' };
	},
};
