import type { CompleteCounterStock } from '$lib/types';
import type { CounterStock } from '@prisma/client';

export function toCompleteCounterStock(stock?: CounterStock): CompleteCounterStock {
	if (!stock) throw Error('Stock is undefined');
	const isNaN = (value: any) => Number.isNaN(Number(value));

	if (isNaN(stock.ob)) throw Error('ob is NaN');
	const total = Number(stock.ob) + Number(stock.received);

	if (isNaN(stock.obPack)) throw Error('obPack is NaN');
	const totalPack = Number(stock.obPack);

	if (isNaN(stock.cb)) throw Error('cb is NaN');
	const sell = total - Number(stock.cb);

	if (isNaN(stock.cbPack)) throw Error('cbPack is NaN');
	const shouldConvertToPack = Number(stock.cbPack) > Number(stock.obPack);
	const sellPack = (shouldConvertToPack ? totalPack + bottleToPack(stock.quantity) : totalPack) - Number(stock.cbPack);

	if (isNaN(stock.price)) throw Error('price is NaN');
	const amountBottles = sell * Number(stock.price);

	if (isNaN(stock.pricePack)) throw Error('pricePack is NaN');
	const amountPacks = sellPack * Number(stock.pricePack);

	const amount = amountBottles + amountPacks;
	return { ...stock, total, totalPack, sell, sellPack, amount };
}

function bottleToPack(quantity: number): number {
	switch (quantity) {
		case 750:
			return 12;
		case 1000:
			return 18;
		case 2000:
			return 33;
		default:
			return 0;
	}
}

export const quantity = [90, 180, 330, 375, 500, 650, 750, 1000, 2000] as const;
