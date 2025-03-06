import prisma from '$lib/server/prisma';
import type { CompleteCounterStock, Quantity } from '$lib/types';
import { calculateAmount, calculateSell, calculateTotal } from '$lib/utils';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params }: PageServerLoadEvent) {
	const date = new Date(params.date);
	const quantity = Number(params.quantity);
	const counterStocks = await prisma.counterStock.findMany({
		where: { date: date, quantity: quantity },
		orderBy: { name: 'asc' },
	});

	const completeStocks = counterStocks.map<CompleteCounterStock>((stock) => {
		const total = calculateTotal(stock);
		const sell = calculateSell(total, stock.cb);
		const amount = calculateAmount(sell, stock.price);
		return { ...stock, total, sell, amount };
	});

	return { counterStocks: completeStocks, date: date.toISOString().split('T')[0], quantity: quantity as Quantity };
}
