<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { toCompleteCounterStock } from '$lib/utils';
	import type { CompleteCounterStock, Quantity } from '$lib/types';
	import type { CounterStock } from '@prisma/client';

	interface Props {
		data: CompleteCounterStock[];
		quantity: Quantity;
		isAdmin?: boolean;
	}

	const { data, quantity, isAdmin = false }: Props = $props();

	const columnsWithoutPack = $derived([
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: `Name/${quantity}ML`, width: 200 },
		{ id: 'quantity', header: 'Quantity (ML)', width: 150, hidden: true },
		{ id: 'ob', header: 'O.B', width: 60, editor: isAdmin ? 'text' : undefined },
		{ id: 'received', header: 'Received', width: 100, editor: 'text' },
		{ id: 'total', header: 'Total', width: 60 },
		{ id: 'cb', header: 'C.B.', width: 60, editor: 'text' },
		{ id: 'sell', header: 'Sell', width: 60 },
		{ id: 'price', header: 'Price', width: 60 },
		{ id: 'amount', header: 'Amount', width: 200 },
	]);

	// Note: Name header was not updating without derived state
	const columnsWithPack = $derived([
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: `Name/${quantity}ML`, width: 200 },
		{ id: 'quantity', header: 'Quantity (ML)', width: 150, hidden: true },
		{
			id: 'ob',
			header: [{ text: 'O.B', colspan: 2 }, { text: 'Bottle' }],
			width: 60,
			editor: isAdmin ? 'text' : undefined,
		},
		{ id: 'obPack', header: ['', { text: 'Pack' }], width: 50, editor: isAdmin ? 'text' : undefined },
		{ id: 'received', header: 'Received', width: 100, editor: 'text' },
		{ id: 'total', header: [{ text: 'Total', colspan: 2 }, { text: 'Bottle' }], width: 60 },
		{ id: 'totalPack', header: ['', { text: 'Pack' }], width: 50 },
		{ id: 'cb', header: [{ text: 'C.B.', colspan: 2 }, { text: 'Bottle' }], width: 60, editor: 'text' },
		{ id: 'cbPack', header: ['', { text: 'Pack' }], width: 50, editor: 'text' },
		{ id: 'sell', header: [{ text: 'Sell', colspan: 2 }, { text: 'Bottle' }], width: 60 },
		{ id: 'sellPack', header: ['', { text: 'Pack' }], width: 50 },
		{ id: 'price', header: [{ text: 'Price', colspan: 2 }, { text: 'Bottle' }], width: 60 },
		{ id: 'pricePack', header: ['', { text: 'Pack' }], width: 50 },
		{ id: 'amount', header: 'Amount', width: 200 },
	]);

	const columns = $derived(quantity < 750 ? columnsWithoutPack : columnsWithPack);
	const isNaN = (value: any) => Number.isNaN(Number(value));

	// TODO: Add types
	// @ts-ignore
	const init = (api) => {
		api.intercept(
			'update-cell',
			async ({ id, column, value }: { id: number; column: keyof CompleteCounterStock; value: number }) => {
				if (isNaN(value)) return false;
				const newValue = Number(value);
				if (newValue < 0) return false;

				const editableFields: Array<keyof CompleteCounterStock> = ['ob', 'obPack', 'received', 'cb', 'cbPack'];

				if (editableFields.includes(column)) {
					try {
						const response = await fetch(`${PUBLIC_BASE_URL}/api/counter/${id}`, {
							body: JSON.stringify({ key: column, value: newValue }),
							method: 'PATCH',
						});

						if (!response.ok) {
							alert('Something went wrong');
							console.log(response);
							return false;
						}
					} catch (error) {
						if (error instanceof Error) alert(error.message);
						else alert('Something went wrong');
						return false;
					}
				}
			},
		);

		api.on('update-cell', ({ id, column }: { id: number; column: string }) => {
			function getCurrentStock() {
				const stocks: CompleteCounterStock[] = api.getState().data;
				const stock: CompleteCounterStock = stocks.find((product) => product.id === id)!;
				// stock[column] = Number(value);
				return stock;
			}

			if (['ob', 'obPack', 'received'].includes(column)) {
				const stock = toCompleteCounterStock(getCurrentStock());
				api.exec('update-cell', { id, column: 'total', value: stock.total });
				api.exec('update-cell', { id, column: 'totalPack', value: stock.totalPack });
			}

			if (['total', 'totalPack', 'cb', 'cbPack'].includes(column)) {
				const stock = toCompleteCounterStock(getCurrentStock());
				api.exec('update-cell', { id, column: 'sell', value: stock.sell });
				api.exec('update-cell', { id, column: 'sellPack', value: stock.sellPack });
			}

			if (['price', 'pricePack', 'sell', 'sellPack'].includes(column)) {
				const stock = toCompleteCounterStock(getCurrentStock());
				api.exec('update-cell', { id, column: 'amount', value: stock.amount });
			}
		});
	};
</script>

<Material>
	<Grid {data} {columns} {init} />
</Material>
