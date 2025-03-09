<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { Quantity } from '$lib/types';
	import type { Product } from '@prisma/client';
	import DeleteProductButton from './DeleteProductButton.svelte';

	const { data, quantity }: { data: Product[]; quantity: Quantity } = $props();

	const columns = $derived([
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: `Name/${quantity}ML`, width: 200, editor: 'text' },
		{ id: 'price', header: 'Price', width: 100, editor: 'text' },
		{ id: 'pricePack', header: 'Pack Price', width: 100, editor: 'text', hidden: quantity < 750 },
		{ id: 'action', header: 'Action', width: 60, cell: DeleteProductButton },
	]);

	const isNaN = (value: any) => Number.isNaN(Number(value));

	// TODO: Add types
	// @ts-ignore
	const init = (api) => {
		api.intercept('update-cell', async ({ id, column, value }: { id: number; column: string; value: any }) => {
			if (column === 'price') {
				if (isNaN(value)) return false;
				value = Number(value);
				if (value < 0) return false;
			}

			const response = await fetch(`${PUBLIC_BASE_URL}/api/products/${id}`, {
				body: JSON.stringify({ key: column, value: value }),
				method: 'PATCH',
			});

			if (!response.ok) return false;
		});
	};
</script>

<Material>
	<Grid {data} {columns} {init} />
</Material>
