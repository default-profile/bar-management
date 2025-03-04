import prisma from '$lib/server/prisma';
import { Temporal } from '@js-temporal/polyfill';
import type { Prisma } from '@prisma/client';

export async function createCounterStocks() {
	const today = Temporal.Now.plainDateISO('Asia/Calcutta');
	const yesterday = today.subtract({ days: 1 });

	const products = await prisma.product.findMany();
	const yesterdaysCounterStocks = await prisma.counterStock.findMany({ where: { date: yesterday.toString() } });

	const counterStocks = products.map<Prisma.CounterStockUncheckedCreateInput>((product) => {
		const yesterdaysCounterStock = yesterdaysCounterStocks.find(({ productId }) => productId === product.id);

		return {
			productId: product.id,
			name: product.name,
			quantity: product.quantity,
			price: product.price,
			date: today.toString(),
			ob: yesterdaysCounterStock ? yesterdaysCounterStock.cb : 0,
			received: 0,
			cb: 0,
		};
	});

	return prisma.counterStock.createManyAndReturn({ data: counterStocks });
}
