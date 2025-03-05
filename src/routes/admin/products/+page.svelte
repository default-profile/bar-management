<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { quantity } from '$lib/utils';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const options = quantity.map((value) => ({ id: value, label: value }));

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
	<Material>
		<Grid data={data.products} {columns} {init} />
	</Material>
</div>
