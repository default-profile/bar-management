export function bottleToPack(quantity: number): number {
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
