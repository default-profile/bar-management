<script lang="ts">
	import { goto } from '$app/navigation';
	import CounterStocksTable from '$lib/components/CounterStocksTable.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<input
	type="date"
	class="input mb-6"
	value={data.date}
	onchange={(e) => goto(`/admin/counter/${e.currentTarget.value}/${data.quantity}`)}
/>

<CounterStocksTable data={data.counterStocks} quantity={data.quantity} isAdmin={true} />
