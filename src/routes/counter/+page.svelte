<script lang="ts">
	import type { CounterProduct } from '@prisma/client';

	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const products = data.products.map((product) => ({
		id: product.id,
		name: product.name,
		quantity: product.quantity,
		ob: product.ob,
		received: product.received,
		get total() {
			return this.ob + this.received;
		},
		cb: product.cb,
		get sell() {
			return this.total - this.cb;
		},
		price: product.price,
		get amount() {
			return this.sell * this.price;
		},
	}));

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
			const response = await fetch(`${PUBLIC_BASE_URL}/counter/${id}`, {
				body: JSON.stringify({ key: column, value: newValue }),
				method: 'PATCH',
			});

			if (!response.ok) return false;
		});

		api.on('update-cell', ({ id, column }: { id: number; column: string }) => {
			if (['ob', 'received'].includes(column)) {
				const products: CounterProduct[] = api.getState().data;
				const product: CounterProduct = products.find((product) => product.id === id)!;
				const total = Number(product.ob) + Number(product.received);
				api.exec('update-cell', { id, column: 'total', value: total });
			}

			if (['total', 'cb'].includes(column)) {
				const products: CounterProduct[] = api.getState().data;
				const product: CounterProduct = products.find((product) => product.id === id)!;
				const sell = Number(product.total) - Number(product.cb);
				api.exec('update-cell', { id, column: 'sell', value: sell });
			}

			if (['price', 'sell'].includes(column)) {
				const products: CounterProduct[] = api.getState().data;
				const product: CounterProduct = products.find((product) => product.id === id)!;
				const amount = Number(product.price) * Number(product.sell);
				api.exec('update-cell', { id, column: 'amount', value: amount });
			}
		});
	};
</script>

<div class="w-full">
	<Material>
		<Grid data={products} {columns} {init} />
	</Material>
</div>
