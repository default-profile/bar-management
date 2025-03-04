import { auth } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import type { CompleteCounterStock } from '$lib/types';
import { calculateAmount, calculateSell, calculateTotal } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (session === null || session.user.role !== 'user') return redirect(302, '/auth/login');
	const counterStocks = await prisma.counterStock.findMany({ orderBy: { name: 'asc' } });
	const completeStocks = counterStocks.map<CompleteCounterStock>((stock) => {
		const total = calculateTotal(stock);
		const sell = calculateSell(total, stock.cb);
		const amount = calculateAmount(sell, stock.price);
		return { ...stock, total, sell, amount };
	});

	return { products: completeStocks.sort((a, b) => Math.sign(a.quantity - b.quantity)) };
};

export const ssr = false;
