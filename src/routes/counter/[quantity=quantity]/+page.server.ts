import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { Temporal } from '@js-temporal/polyfill';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params, request }: PageServerLoadEvent) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (session === null || session.user.role !== 'user') return redirect(302, '/auth/login');

	const quantity = Number(params.quantity);
	const today = Temporal.Now.plainDateISO('Asia/Calcutta');
	const counterStocks = await prisma.counterStock.findMany({
		where: { date: new Date(today.toString()), quantity: quantity },
		orderBy: { name: 'asc' },
	});

	return { counterStocks, quantity };
}
