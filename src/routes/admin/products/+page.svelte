<script lang="ts">
	// @ts-ignore
	import { Grid, WillowDark } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const options = [
		{ id: 90, label: 90 },
		{ id: 180, label: 180 },
		{ id: 330, label: 330 },
		{ id: 375, label: 375 },
		{ id: 500, label: 500 },
		{ id: 650, label: 650 },
		{ id: 750, label: 750 },
		{ id: 1000, label: 1000 },
		{ id: 2000, label: 2000 },
	];

	const columns = [
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: 'Name', width: 200, editor: 'text' },
		{
			id: 'quantity',
			header: 'Quantity (ML)',
			width: 150,
			editor: 'richselect',
			options: options,
		},
		{ id: 'price', header: 'Price', width: 100, editor: 'text' },
	];

	const isNaN = (value: any) => Number.isNaN(Number(value));

	// TODO: Add types
	const init = (api) => {
		api.intercept('update-cell', async ({ id, column, value }: { id: number; column: string; value: any }) => {
			if (column === 'quantity' && !options.map(({ id }) => id).includes(value)) return false;

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

<div class="w-full">
	<WillowDark>
		<Grid data={data.products} {columns} {init} />
	</WillowDark>
</div>
