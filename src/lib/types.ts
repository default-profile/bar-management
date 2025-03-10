import type { CounterStock } from '@prisma/client';

export interface CompleteCounterStock extends CounterStock {
	total: number;
	totalPack: number;
	sell: number;
	sellPack: number;
	amount: number;
}
