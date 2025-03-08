import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { CompleteCounterStock, Quantity } from '$lib/types';
import { Temporal } from '@js-temporal/polyfill';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';
import { toCompleteCounterStock } from '$lib/utils';

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

	const completeStocks = counterStocks.map(toCompleteCounterStock);
	return { counterStocks: completeStocks, quantity: quantity as Quantity };
}
