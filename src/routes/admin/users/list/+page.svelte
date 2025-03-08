<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const columns = [
		{ id: 'id', header: '#', width: 50, hidden: true },
		{ id: 'name', header: `Name`, width: 200, editor: 'text' },
		{ id: 'email', header: 'Email', width: 400, editor: 'text' },
	];
</script>

<Material>
	<Grid data={data.users} {columns} />
</Material>
