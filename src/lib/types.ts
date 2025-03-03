import type { CounterStock } from '@prisma/client';

export interface CompleteCounterStock extends CounterStock {
	total: number;
	sell: number;
	amount: number;
}
