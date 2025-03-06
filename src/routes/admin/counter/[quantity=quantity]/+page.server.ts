import prisma from '$lib/server/prisma';
import type { CompleteCounterStock, Quantity } from '$lib/types';
import { calculateAmount, calculateSell, calculateTotal } from '$lib/utils';
import { Temporal } from '@js-temporal/polyfill';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params, request }: PageServerLoadEvent) {
	const quantity = Number(params.quantity);
	const today = Temporal.Now.plainDateISO('Asia/Calcutta');
	const counterStocks = await prisma.counterStock.findMany({
		where: { date: new Date(today.toString()), quantity: quantity },
		orderBy: { name: 'asc' },
	});

	const completeStocks = counterStocks.map<CompleteCounterStock>((stock) => {
		const total = calculateTotal(stock);
		const sell = calculateSell(total, stock.cb);
		const amount = calculateAmount(sell, stock.price);
		return { ...stock, total, sell, amount };
	});

	return { counterStocks: completeStocks, quantity: quantity as Quantity };
}
