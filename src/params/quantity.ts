import type { Quantity } from '$lib/types';
import { quantity } from '$lib/utils';

export function match(value: string): boolean {
	return quantity.includes(Number(value) as Quantity);
}
