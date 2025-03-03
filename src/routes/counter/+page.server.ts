import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const products = await prisma.counterProduct.findMany({ orderBy: { name: 'asc' } });
	return { products: products.sort((a, b) => Math.sign(a.quantity - b.quantity)) };
};

export const ssr = false;
