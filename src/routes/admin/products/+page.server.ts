import prisma from '$lib/server/prisma';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ request }: PageServerLoadEvent) {
	const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
	return { products: products.sort((a, b) => Math.sign(a.quantity - b.quantity)) };
}
