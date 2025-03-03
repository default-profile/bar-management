<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import type { PageProps } from './$types';
	import { page } from '$app/state';

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
		api.intercept('update-cell', async ({ id, column, value }) => {
			if (isNaN(value)) return false;
			const newValue = Number(value);
			const response = await fetch(`${page.url.origin}/counter/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ key: column, value: newValue }),
			});

			if (!response.ok) return false;
		});
	};
</script>

<div class="w-full">
	<Material>
		<Grid data={data.products} {columns} {init} />
	</Material>
</div>
