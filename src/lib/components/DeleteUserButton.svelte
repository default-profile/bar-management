<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import DeleteButton from './DeleteButton.svelte';

	const { api, row }: any = $props();

	async function deleteUser() {
		const { error } = await authClient.admin.removeUser({ userId: row.id });
		if (!error) api.exec('delete-row', { id: row.id });
		else alert(error.message);
	}
</script>

<DeleteButton onClick={deleteUser} />
