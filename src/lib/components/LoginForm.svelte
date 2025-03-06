<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	interface Props {
		title: string;
		onSuccess?: () => void;
		onError?: (error: { error: { message: string } }) => void;
	}

	const { title, onSuccess = () => goto('/'), onError = ({ error }) => alert(error.message) }: Props = $props();

	const data = $state({ email: '', password: '' });
	async function login(e: SubmitEvent) {
		e.preventDefault();
		await authClient.signIn.email(data, { onSuccess, onError });
	}
</script>

<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
	<form class="card-body" onsubmit={login}>
		<div class="text-2xl">{title}</div>
		<fieldset class="fieldset">
			<label for="email" class="fieldset-label">Email</label>
			<input id="email" type="email" class="input" placeholder="Email" bind:value={data.email} />
			<label for="password" class="fieldset-label">Password</label>
			<input id="password" type="password" class="input" placeholder="Password" bind:value={data.password} />
			<button class="btn mt-4 btn-neutral">Login</button>
		</fieldset>
	</form>
</div>
