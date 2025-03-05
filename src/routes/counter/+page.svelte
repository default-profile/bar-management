<script lang="ts">
	import type { CompleteCounterStock } from '$lib/types';
	import { calculateAmount, calculateSell, calculateTotal } from '$lib/utils';

	// @ts-ignore
	import { Grid, WillowDark } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const columns = [
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: 'Name', width: 200 },
		{ id: 'quantity', header: 'Quantity (ML)', width: 150 },
		{ id: 'ob', header: 'O.B.', width: 100 },
		{ id: 'received', header: 'Received', width: 100, editor: 'text' },
		{ id: 'total', header: 'Total', width: 100 },
		{ id: 'cb', header: 'C.B', width: 100, editor: 'text' },
		{ id: 'sell', header: 'Sell', width: 100 },
		{ id: 'price', header: 'Price', width: 100 },
		{ id: 'amount', header: 'Amount', width: 200 },
	];

	const isNaN = (value: any) => Number.isNaN(Number(value));

	// TODO: Add types
	const init = (api) => {
		api.intercept('update-cell', async ({ id, column, value }: { id: number; column: string; value: any }) => {
			if (!['received', 'cb'].includes(column)) return;
			if (isNaN(value)) return false;
			const newValue = Number(value);
			if (newValue < 0) return false;

			if (column === 'cb') {
				const products: CompleteCounterStock[] = api.getState().data;
				const product: CompleteCounterStock = products.find((product) => product.id === id)!;
				const total = calculateTotal(product);
				if (newValue > total) {
					alert('Closing balance must be less than or equal to total');
					return false;
				}
			}

			const response = await fetch(`${PUBLIC_BASE_URL}/api/counter/${id}`, {
				body: JSON.stringify({ key: column, value: newValue }),
				method: 'PATCH',
			});

			if (!response.ok) return false;
		});

		api.on('update-cell', ({ id, column }: { id: number; column: string }) => {
			if (['ob', 'received'].includes(column)) {
				const products: CompleteCounterStock[] = api.getState().data;
				const product: CompleteCounterStock = products.find((product) => product.id === id)!;
				api.exec('update-cell', { id, column: 'total', value: calculateTotal(product) });
			}

			if (['total', 'cb'].includes(column)) {
				const products: CompleteCounterStock[] = api.getState().data;
				const product: CompleteCounterStock = products.find((product) => product.id === id)!;
				api.exec('update-cell', { id, column: 'sell', value: calculateSell(product) });
			}

			if (['price', 'sell'].includes(column)) {
				const products: CompleteCounterStock[] = api.getState().data;
				const product: CompleteCounterStock = products.find((product) => product.id === id)!;
				api.exec('update-cell', { id, column: 'amount', value: calculateAmount(product) });
			}
		});
	};
</script>

<div class="w-full">
	<WillowDark>
		<Grid data={data.products} {columns} {init} />
	</WillowDark>
</div>
