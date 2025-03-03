<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	const data = $state({ email: '', password: '' });

	async function login(e: SubmitEvent) {
		e.preventDefault();
		await authClient.signIn.email(data, {
			onSuccess(context) {
				alert('Login successful');
				goto('/');
			},
			onError(context) {
				alert('Login failed');
			},
		});
	}
</script>

<form onsubmit={login}>
	<input type="email" name="email" placeholder="Email" bind:value={data.email} />
	<input type="password" name="password" placeholder="Password" bind:value={data.password} />
	<button type="submit">Login</button>
</form>
