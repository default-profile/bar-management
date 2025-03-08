import prisma from '$lib/server/prisma';
import type { CompleteCounterStock, Quantity } from '$lib/types';
import { toCompleteCounterStock } from '$lib/utils';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params }: PageServerLoadEvent) {
	const date = new Date(params.date);
	const quantity = Number(params.quantity);
	const counterStocks = await prisma.counterStock.findMany({
		where: { date: date, quantity: quantity },
		orderBy: { name: 'asc' },
	});

	const completeStocks = counterStocks.map<CompleteCounterStock>(toCompleteCounterStock);
	return { counterStocks: completeStocks, date: date.toISOString().split('T')[0], quantity: quantity as Quantity };
}
