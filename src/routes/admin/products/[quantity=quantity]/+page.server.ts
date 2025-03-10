import prisma from '$lib/server/prisma';
import type { PageServerLoadEvent } from './$types';

export const ssr = false;

export async function load({ params }: PageServerLoadEvent) {
	const quantity = Number(params.quantity);
	const products = await prisma.product.findMany({ where: { quantity }, orderBy: { name: 'asc' } });
	return { products: products, quantity: quantity };
}
