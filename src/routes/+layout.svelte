<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	const { children } = $props();
	let navbarHeight = $state(0);
</script>

<svelte:head>
	<title>Bar Management</title>
</svelte:head>

<Navbar bind:height={navbarHeight} />
<div class="p-6" style="height: calc(100vh - {navbarHeight}px);">
	{@render children()}
</div>
