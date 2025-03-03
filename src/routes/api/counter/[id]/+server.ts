import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { key, value } = await request.json();
	await prisma.counterStock.update({ where: { id: Number(params.id) }, data: { [key]: value } });
	return new Response(JSON.stringify({}));
};
