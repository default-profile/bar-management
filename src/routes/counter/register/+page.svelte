<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const formData = $state({ name: '', email: '', password: '' });

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const { data, error } = await authClient.signUp.email(
			{
				name: formData.name,
				email: formData.email,
				password: formData.password,
			},
			{
				onSuccess: (ctx) => {
					goto('/', { replaceState: true });
				},
				onError(ctx) {
					alert('Fail');
				},
			},
		);
	}
</script>

<form onsubmit={onSubmit}>
	<input type="text" name="name" placeholder="Name" bind:value={formData.name} />
	<input type="email" name="email" placeholder="Email" bind:value={formData.email} />
	<input type="password" name="password" placeholder="Password" bind:value={formData.password} />
	<button type="submit">Register</button>
</form>
