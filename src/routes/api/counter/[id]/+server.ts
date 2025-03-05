import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function PATCH({ params, request }: RequestEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response(JSON.stringify({}), { status: 401 });
	const { key, value } = await request.json();
	await prisma.counterStock.update({ where: { id: Number(params.id) }, data: { [key]: value } });
	return new Response(JSON.stringify({}));
}
