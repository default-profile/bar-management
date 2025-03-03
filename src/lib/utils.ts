import type { CompleteCounterStock } from '$lib/types';
import type { CounterStock } from '@prisma/client';

export function calculateTotal(ob: number | string, received: number | string): number;
export function calculateTotal(product: CounterStock | CompleteCounterStock): number;
export function calculateTotal(
	obOrProduct: number | string | CounterStock | CompleteCounterStock,
	received?: number | string,
): number {
	const calculate = (ob: number | string, received?: number | string) => Number(ob) + Number(received);
	if (typeof obOrProduct === 'object') return calculate(obOrProduct.ob, obOrProduct.received);
	else return calculate(obOrProduct, received);
}

export function calculateSell(product: CompleteCounterStock): number;
export function calculateSell(total: number | string, cb: number | string): number;
export function calculateSell(totalOrProduct: number | string | CompleteCounterStock, cb?: number | string): number {
	const calculate = (total: number | string, cb?: number | string) => Number(total) - Number(cb);
	if (typeof totalOrProduct === 'object') return calculate(totalOrProduct.total, totalOrProduct.cb);
	else return calculate(totalOrProduct, cb);
}

export function calculateAmount(product: CompleteCounterStock): number;
export function calculateAmount(sell: number | string, price: number | string): number;
export function calculateAmount(
	sellOrProduct: number | string | CompleteCounterStock,
	price?: number | string,
): number {
	const calculate = (sell: number | string, price?: number | string) => Number(sell) * Number(price);
	if (typeof sellOrProduct === 'object') return calculate(sellOrProduct.sell, sellOrProduct.price);
	else return calculate(sellOrProduct, price);
}
