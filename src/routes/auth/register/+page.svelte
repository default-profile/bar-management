<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	const data = $state({ name: '', email: '', password: '' });

	async function register(e: SubmitEvent) {
		e.preventDefault();
		await authClient.signUp.email(data, {
			onSuccess: () => goto('/'),
			onError: ({ error }) => alert(error.message),
		});
	}
</script>

<form onsubmit={register}>
	<input type="text" name="name" placeholder="Name" bind:value={data.name} />
	<input type="email" name="email" placeholder="Email" bind:value={data.email} />
	<input type="password" name="password" placeholder="Password" bind:value={data.password} />
	<button type="submit">Register</button>
</form>
