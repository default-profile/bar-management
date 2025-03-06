<script lang="ts">
	import ProductsTable from '$lib/components/ProductsTable.svelte';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	const { data }: PageProps = $props();
</script>

<div class="flex h-full">
	<div class="overflow-y-scroll">
		<ProductsTable data={data.products} quantity={data.quantity} />
	</div>
	<div class="flex grow items-center justify-center">
		<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
			<form class="card-body" method="POST" action="?/addProduct" use:enhance>
				<label for="name" class="fieldset-label">Name</label>
				<input id="name" type="text" name="name" class="input" placeholder="Name" />
				<label for="price" class="fieldset-label">Price</label>
				<input id="price" type="number" name="price" class="input" placeholder="Price" />
				<input type="number" class="input" name="quantity" value={data.quantity} hidden />
				<button type="submit" class="btn mt-4 btn-neutral">Add</button>
			</form>
		</div>
	</div>
</div>
