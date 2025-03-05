<script lang="ts">
	import CounterStocksTable from '$lib/components/CounterStocksTable.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<CounterStocksTable data={data.counterStocks} quantity={data.quantity} />
