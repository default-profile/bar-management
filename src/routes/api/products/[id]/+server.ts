import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function PATCH({ params, request }: RequestEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

	const { key, value } = await request.json();
	await prisma.product.update({ where: { id: Number(params.id) }, data: { [key]: value } });
	return Response.json({});
}

export async function DELETE({ params, request }: RequestEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') Response.json({ message: 'Forbidden' }, { status: 403 });

	await prisma.product.delete({ where: { id: Number(params.id) } });
	return Response.json({});
}
