<script lang="ts">
	import DeleteButton from './DeleteButton.svelte';

	const { api, row }: any = $props();

	async function deleteProduct() {
		const response = await fetch(`/api/products/${row.id}`, {
			method: 'DELETE',
		});

		if (response.ok) api.exec('delete-row', { id: row.id });
		else alert('Something went wrong');
	}
</script>

<DeleteButton onClick={deleteProduct} />
