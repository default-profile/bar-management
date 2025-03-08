<script lang="ts">
	import ProductsTable from '$lib/components/ProductsTable.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<ProductsTable data={data.products} quantity={data.quantity} />
