import prisma from '$lib/server/prisma';
import { Temporal } from '@js-temporal/polyfill';
import type { Prisma } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }: RequestEvent) {
	const authorizationHeader = request.headers.get('Authorization');
	if (authorizationHeader !== `Bearer ${env.PRIVATE_CRON_SECRET}`) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	}

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

	await prisma.counterStock.createMany({ data: counterStocks });
	return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
}
