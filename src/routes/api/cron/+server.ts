import prisma from '$lib/server/prisma';
import { Temporal } from '@js-temporal/polyfill';
import type { Prisma } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ request }: RequestEvent) {
	// Prevent unauthorized access by adding the CRON_SECRET environment variable to your project
	// and check incoming requests. Vercel will add it to all cron job invocations as part of
	// the Authorization header, allowing you to specify any value you'd like for authorization.
	const authorizationHeader = request.headers.get('Authorization');
	if (authorizationHeader !== `Bearer ${env.CRON_SECRET}`) {
		return Response.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const today = Temporal.Now.plainDateISO('Asia/Calcutta');
	const yesterday = today.subtract({ days: 1 });

	const products = await prisma.product.findMany();
	const yesterdaysCounterStocks = await prisma.counterStock.findMany({
		where: { date: new Date(Date.parse(yesterday.toString())) },
	});

	const counterStocks = products.map<Prisma.CounterStockUncheckedCreateInput>((product) => {
		const yesterdaysCounterStock = yesterdaysCounterStocks.find(({ productId }) => productId === product.id);

		return {
			productId: product.id,
			name: product.name,
			quantity: product.quantity,
			price: product.price,
			pricePack: product.pricePack,
			date: new Date(Date.parse(today.toString())),
			ob: yesterdaysCounterStock ? yesterdaysCounterStock.cb : 0,
			obPack: yesterdaysCounterStock ? yesterdaysCounterStock.cbPack : 0,
			received: 0,
			cb: 0,
		};
	});

	try {
		await prisma.counterStock.createMany({ data: counterStocks });
		return Response.json({});
	} catch (error) {
		return Response.json(error, { status: 400 });
	}
}
