<script lang="ts">
	import { goto } from '$app/navigation';
	import CounterStocksTable from '$lib/components/CounterStocksTable.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let height = $state(0);
</script>

<div class="h-full">
	<input
		bind:clientHeight={height}
		type="date"
		class="input mb-6"
		value={data.date}
		onchange={(e) => goto(`/admin/counter/${e.currentTarget.value}/${data.quantity}`)}
	/>

	<div style="height: calc(100% - {height}px - var(--spacing) * 6);">
		<CounterStocksTable data={data.counterStocks} quantity={data.quantity} isAdmin={true} />
	</div>
</div>
