<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { toCompleteCounterStock } from '$lib/utils';
	import type { CounterStock } from '@prisma/client';

	interface Props {
		data: CounterStock[];
		quantity: number;
		isAdmin?: boolean;
	}

	const { data, quantity, isAdmin = false }: Props = $props();

	const columnsWithoutPack = $derived([
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: `Name/${quantity}ML`, width: 200 },
		{ id: 'quantity', header: 'Quantity (ML)', width: 150, hidden: true },
		{
			id: 'ob',
			header: 'O.B',
			width: 60,
			editor: isAdmin ? 'text' : undefined,
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.ob = Number(value);
			},
		},
		{
			id: 'received',
			header: 'Received',
			width: 100,
			editor: 'text',
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.received = Number(value);
			},
		},
		{
			id: 'total',
			header: 'Total',
			width: 60,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).total;
			},
		},
		{
			id: 'cb',
			header: 'C.B.',
			width: 60,
			editor: 'text',
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.cb = Number(value);
			},
		},
		{
			id: 'sell',
			header: 'Sell',
			width: 60,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).sell;
			},
		},
		{ id: 'price', header: 'Price', width: 60 },
		{
			id: 'amount',
			header: 'Amount',
			width: 200,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).amount;
			},
		},
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
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.ob = Number(value);
			},
		},
		{
			id: 'obPack',
			header: ['', { text: 'Pack' }],
			width: 50,
			editor: isAdmin ? 'text' : undefined,
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.obPack = Number(value);
			},
		},
		{
			id: 'received',
			header: 'Received',
			width: 100,
			editor: 'text',
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.received = Number(value);
			},
		},
		{
			id: 'total',
			header: [{ text: 'Total', colspan: 2 }, { text: 'Bottle' }],
			width: 60,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).total;
			},
		},
		{
			id: 'totalPack',
			header: ['', { text: 'Pack' }],
			width: 50,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).totalPack;
			},
		},
		{
			id: 'cb',
			header: [{ text: 'C.B.', colspan: 2 }, { text: 'Bottle' }],
			width: 60,
			editor: 'text',
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.cb = Number(value);
			},
		},
		{
			id: 'cbPack',
			header: ['', { text: 'Pack' }],
			width: 50,
			editor: 'text',
			setter(row: CounterStock, value: string | number) {
				if (isNaN(value)) return;
				row.cbPack = Number(value);
			},
		},
		{
			id: 'sell',
			header: [{ text: 'Sell', colspan: 2 }, { text: 'Bottle' }],
			width: 60,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).sell;
			},
		},
		{
			id: 'sellPack',
			header: ['', { text: 'Pack' }],
			width: 50,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).sellPack;
			},
		},
		{ id: 'price', header: [{ text: 'Price', colspan: 2 }, { text: 'Bottle' }], width: 60 },
		{ id: 'pricePack', header: ['', { text: 'Pack' }], width: 50 },
		{
			id: 'amount',
			header: 'Amount',
			width: 200,
			getter(row: CounterStock) {
				return toCompleteCounterStock(row).amount;
			},
		},
	]);

	// TODO: Use column getters for derived properties
	const columns = $derived(quantity < 750 ? columnsWithoutPack : columnsWithPack);
	const isNaN = (value: any) => Number.isNaN(Number(value));

	// TODO: Add types
	// @ts-ignore
	const init = (api) => {
		api.intercept(
			'update-cell',
			async ({ id, column, value }: { id: number; column: keyof CounterStock; value: number }) => {
				if (isNaN(value)) return false;
				const newValue = Number(value);
				if (newValue < 0) return false;

				const editableFields: Array<keyof CounterStock> = ['ob', 'obPack', 'received', 'cb', 'cbPack'];

				if (editableFields.includes(column)) {
					try {
						const response = await fetch(`${PUBLIC_BASE_URL}/api/counter/${id}`, {
							body: JSON.stringify({ key: column, value: newValue }),
							method: 'PATCH',
						});

						if (!response.ok) {
							alert('Something went wrong');
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
	};
</script>

<Material>
	<Grid {data} {columns} {init} />
</Material>
