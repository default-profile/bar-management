import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export async function load({ request }: LayoutServerLoadEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session || session.user.role !== 'admin') return redirect(302, '/auth/login-admin');
}
