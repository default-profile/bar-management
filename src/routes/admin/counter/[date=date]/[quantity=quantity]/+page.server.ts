import prisma from '$lib/server/prisma';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params }: PageServerLoadEvent) {
	const date = new Date(params.date);
	const quantity = Number(params.quantity);
	const counterStocks = await prisma.counterStock.findMany({
		where: { date: date, quantity: quantity },
		orderBy: { name: 'asc' },
	});

	return { counterStocks, date: date.toISOString().split('T')[0], quantity };
}
