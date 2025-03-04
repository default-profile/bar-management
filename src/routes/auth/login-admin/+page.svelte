<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	const data = $state({ email: '', password: '' });

	async function login(e: SubmitEvent) {
		e.preventDefault();
		await authClient.signIn.email(data, {
			onSuccess: (context) => goto('/'),
			onError: (context) => alert('Login failed'),
		});
	}
</script>

<!--<form onsubmit={login}>-->
<!--	<input type="email" name="email" placeholder="Email" bind:value={data.email} />-->
<!--	<input type="password" name="password" placeholder="Password" bind:value={data.password} />-->
<!--	<button type="submit">Login</button>-->
<!--</form>-->

<div class="flex justify-center">
	<div class="card mt-16 w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
		<div class="text-2xl">Admin Login</div>
		<form class="card-body" onsubmit={login}>
			<fieldset class="fieldset">
				<label for="email" class="fieldset-label">Email</label>
				<input id="email" type="email" class="input" placeholder="Email" bind:value={data.email} />
				<label for="password" class="fieldset-label">Password</label>
				<input id="password" type="password" class="input" placeholder="Password" bind:value={data.password} />
				<!--				<div><a href="#" class="link link-hover">Forgot password?</a></div>-->
				<button class="btn mt-4 btn-neutral">Login</button>
			</fieldset>
		</form>
	</div>
</div>
